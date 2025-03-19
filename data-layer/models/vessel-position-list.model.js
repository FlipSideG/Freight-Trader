const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Status history sub-schema
const statusHistorySchema = new Schema({
    status: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now }
}, { _id: false });

// Vessel entry sub-schema
const vesselEntrySchema = new Schema({
    vesselName: { type: String, required: true },
    imo: { type: String, required: true },
    buildYear: { type: Number },
    dwt: { 
        type: Number,
        validate: {
            validator: function(v) {
                return v == null || v >= 0;
            },
            message: 'DWT cannot be negative'
        }
    },
    cbm: { 
        type: Number,
        validate: {
            validator: function(v) {
                return v == null || v >= 0;
            },
            message: 'CBM cannot be negative'
        }
    },
    exportPort: { 
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                return v && v.trim().length > 0;
            },
            message: 'Export port cannot be empty'
        }
    },
    openDate: { 
        type: Date, 
        required: true,
        validate: {
            validator: function(v) {
                return v instanceof Date && !isNaN(v);
            },
            message: 'Open date must be a valid date'
        }
    },
    owner: { type: String },
    iceClass: { type: String },
    cargoPreferences: { type: String },
    comments: { type: String },
    status: {
        type: String,
        enum: ['available', 'on Subs', 'fully fixed'],
        default: 'available'
    },
    isDuplicate: { type: Boolean, default: false },
    distanceToRegion: { type: Number }, // Distance from exportPort to region (e.g., 500 NM)
    regionOfExportPort: { type: String }, // Region of exportPort (e.g., "ARA")
    statusHistory: [statusHistorySchema] // Tracks status changes
}, { _id: false });

// Main schema
const vesselPositionListSchema = new Schema({
    region: {
        type: String,
        required: true
    },
    vesselType: {
        type: String,
        required: true,
        enum: ['MR', 'LR1', 'LR2', 'VLCC', 'Suezmax', 'Aframax', 'Handysize', 'Other']
    },
    date: {
        type: Date,
        required: true,
        index: true
    },
    availableCount: {
        type: Number,
        required: true,
        min: 0
    },
    vessels: [vesselEntrySchema],
    source: {
        type: String,
        required: true,
        enum: ['email', 'iceMessenger', 'api', 'manual']
    },
    metadata: {
        emailId: String,
        scrapeTimestamp: Date,
        broker: String
    },
    isCustom: {
        type: Boolean,
        default: false
    },
    listName: {
        type: String,
        required: function() {
            return this.isCustom;
        }
    },
    customRegions: {
        type: [String],
        default: []
    },
    customVesselTypes: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

// Indexes
vesselPositionListSchema.index({ region: 1, vesselType: 1, date: -1 });
vesselPositionListSchema.index({ 'vessels.imo': 1 });
vesselPositionListSchema.index({ source: 1 });
vesselPositionListSchema.index({ isCustom: 1, region: 1, vesselType: 1 });
vesselPositionListSchema.index({ 'vessels.exportPort': 1 });
vesselPositionListSchema.index({ 'vessels.openDate': 1 });
vesselPositionListSchema.index({ 'customRegions': 1, 'customVesselTypes': 1 }); // For querying custom lists

// Mock function to map exportPort to region (replace with real mapping later)
function mockMapPortToRegion(port) {
    // TODO: Replace with actual mapping logic or API call (e.g., Dataloy or port database)
    const portToRegionMap = {
        'ANTWERP': 'ARA',
        'ROTTERDAM': 'ARA',
        'FALMOUTH': 'ARA',
        'GIBRALTAR': 'Mediterranean',
        'AMSTERDAM': 'ARA',
        'PIRAEUS': 'Mediterranean',
        'ALEXANDRIA': 'Mediterranean',
        'VALENCIA': 'Mediterranean',
        'HOUSTON': 'USGC',
        'NEW ORLEANS': 'USGC',
        'TAMPA': 'USGC',
        'SINGAPORE': 'Singapore',
        'JURONG': 'Singapore',
        'PULAU BUKOM': 'Singapore',
        'FUJAIRAH': 'Middle East',
        'JEBEL ALI': 'Middle East',
        'RAS TANURA': 'Middle East'
    };
    return portToRegionMap[port] || 'Other';
}

// Mock function for distance calculation (replace with Dataloy API)
async function mockCalculateDistance(fromPort, toPort) {
    // TODO: Replace with actual Dataloy API call for distance calculation
    const mockDistances = {
        'ANTWERP-ARA': 0, // Same region
        'GIBRALTAR-ARA': 500, // Example distance
        'ROTTERDAM-ARA': 10, // Close within ARA
        'ANTWERP-Port XX': 0,
        'GIBRALTAR-Port XX': 500,
        'ROTTERDAM-Port XX': 10,
        'PIRAEUS-ARA': 1500,
        'ALEXANDRIA-ARA': 2000,
        'VALENCIA-ARA': 800,
        'HOUSTON-ARA': 4000,
        'NEW ORLEANS-ARA': 4100,
        'TAMPA-ARA': 4200,
        'SINGAPORE-ARA': 8000,
        'JURONG-ARA': 8000,
        'PULAU BUKOM-ARA': 8000,
        'FUJAIRAH-ARA': 6000,
        'JEBEL ALI-ARA': 6000,
        'RAS TANURA-ARA': 6000
    };
    return mockDistances[`${fromPort}-${toPort}`] || 1000; // Default distance if not found
}

// Pre-save middleware to validate and update availableCount
vesselPositionListSchema.pre('save', async function(next) {
    if (this.vessels) {
        for (const vessel of this.vessels) {
            // Validate openDate (not more than 1 year in the past or future)
            const oneYearBefore = new Date(this.date);
            oneYearBefore.setFullYear(oneYearBefore.getFullYear() - 1);
            const oneYearAfter = new Date(this.date);
            oneYearAfter.setFullYear(oneYearAfter.getFullYear() + 1);
            if (vessel.openDate < oneYearBefore) {
                return next(new Error('Open date cannot be more than 1 year in the past relative to the list date'));
            }
            if (vessel.openDate > oneYearAfter) {
                return next(new Error('Open date cannot be more than 1 year in the future relative to the list date'));
            }

            // Calculate distanceToRegion and set regionOfExportPort
            try {
                vessel.distanceToRegion = await mockCalculateDistance(vessel.exportPort, this.region);
            } catch (error) {
                console.error(`Failed to calculate distance from ${vessel.exportPort} to ${this.region}: ${error.message}`);
                vessel.distanceToRegion = 1000; // Default distance if calculation fails
            }
            vessel.regionOfExportPort = mockMapPortToRegion(vessel.exportPort);
        }

        // Update availableCount: count vessels where status is "available" and openDate <= date
        this.availableCount = this.vessels.filter(v => 
            v.status === 'available' && v.openDate <= this.date
        ).length;
    }
    next();
});

// Static method to create custom list
vesselPositionListSchema.statics.createCustomList = async function(params) {
    const { listName, regions, vesselTypes, startDate, endDate } = params;
    
    // Find all matching lists
    const lists = await this.find({
        region: { $in: regions },
        vesselType: { $in: vesselTypes },
        date: { $gte: startDate, $lte: endDate },
        isCustom: false
    });

    // Combine vessels, deduplicating by IMO
    const vesselMap = new Map();
    lists.forEach(list => {
        list.vessels.forEach(vessel => {
            if (!vesselMap.has(vessel.imo)) {
                vesselMap.set(vessel.imo, vessel);
            }
        });
    });

    // Create new custom list
    return this.create({
        region: regions.join(', '),
        vesselType: vesselTypes.join(', '),
        date: new Date(),
        availableCount: Array.from(vesselMap.values()).filter(v => 
            v.status === 'available' && v.openDate <= new Date()
        ).length,
        vessels: Array.from(vesselMap.values()),
        source: 'manual',
        isCustom: true,
        listName,
        customRegions: regions,
        customVesselTypes: vesselTypes
    });
};

// Method to update vessel status
vesselPositionListSchema.methods.updateVesselStatus = async function(imo, status) {
    const vessel = this.vessels.find(v => v.imo === imo);
    if (vessel) {
        // Only update if the status has changed
        if (vessel.status !== status) {
            vessel.status = status;
            vessel.statusHistory.push({ status, timestamp: new Date() });
            await this.save();
            return true;
        }
        return false; // No change in status
    }
    return false; // Vessel not found
};

// Method to deduplicate vessels
vesselPositionListSchema.methods.deduplicateVessels = function() {
    const vesselMap = new Map();
    this.vessels.forEach(vessel => {
        if (!vesselMap.has(vessel.imo)) {
            vesselMap.set(vessel.imo, vessel);
        } else {
            vessel.isDuplicate = true;
        }
    });
    this.vessels = Array.from(vesselMap.values());
};

// Static method to find ships available from a specified port
vesselPositionListSchema.statics.findShipsFromPort = async function(port, options = {}) {
    const { regions, vesselTypes, date = new Date() } = options;

    // Find matching lists
    const query = {
        date: { $lte: date },
        isCustom: false
    };
    if (regions) query.region = { $in: regions };
    if (vesselTypes) query.vesselType = { $in: vesselTypes };

    const lists = await this.find(query).sort({ date: -1 });

    // Collect available vessels
    const availableVessels = [];
    for (const list of lists) {
        for (const vessel of list.vessels) {
            if (vessel.status === 'available' && vessel.openDate <= date && !vessel.isDuplicate) {
                // Calculate distance from exportPort to specified port
                let distance;
                try {
                    distance = await mockCalculateDistance(vessel.exportPort, port);
                } catch (error) {
                    console.error(`Failed to calculate distance from ${vessel.exportPort} to ${port}: ${error.message}`);
                    distance = 1000; // Default distance if calculation fails
                }

                // TODO: Replace mock speed with actual speed from Vessel/NoonReport data
                const speed = 14; // knots (mock value)
                const transitTimeHours = distance / speed;

                availableVessels.push({
                    vesselName: vessel.vesselName,
                    imo: vessel.imo,
                    exportPort: vessel.exportPort,
                    openDate: vessel.openDate,
                    region: list.region,
                    vesselType: list.vesselType,
                    distanceToPort: distance,
                    transitTimeHours: transitTimeHours
                });
            }
        }
    }

    // Sort by distance
    return availableVessels.sort((a, b) => a.distanceToPort - b.distanceToPort);
};

const VesselPositionList = mongoose.model('VesselPositionList', vesselPositionListSchema);

module.exports = VesselPositionList; 