const mongoose = require('mongoose');

// Sub-schemas for nested data
const ownerInfoSchema = new mongoose.Schema({
  name: { type: String },
  address: { type: String },
  country: { type: String },
  tel: { type: String },
  fax: { type: String },
  telex: { type: String },
  email: { type: String },
  website: { type: String },
  companyIMO: { type: String }
}, { _id: false });

const dimensionsSchema = new mongoose.Schema({
  lengthOverall: { type: Number }, // in meters
  lengthBetweenPerpendiculars: { type: Number }, // in meters
  beam: { type: Number }, // in meters
  mouldedDepth: { type: Number }, // in meters
  keelToMasthead: { type: Number }, // in meters
  bridgeFrontToManifold: { type: Number }, // in meters
  bowToCenterManifold: { type: Number }, // in meters
  sternToCenterManifold: { type: Number }, // in meters
  parallelBody: {
    lightship: {
      forwardToMidPointManifold: { type: Number },
      aftToMidPointManifold: { type: Number },
      length: { type: Number }
    },
    normalBallast: {
      forwardToMidPointManifold: { type: Number },
      aftToMidPointManifold: { type: Number },
      length: { type: Number }
    },
    summerDwt: {
      forwardToMidPointManifold: { type: Number },
      aftToMidPointManifold: { type: Number },
      length: { type: Number }
    }
  }
}, { _id: false });

const tonnagesSchema = new mongoose.Schema({
  net: { type: Number },
  gross: { type: Number },
  reducedGross: { type: Number },
  suezCanalGross: { type: Number },
  suezCanalNet: { type: Number },
  panamaCanalNet: { type: Number }
}, { _id: false });

const loadlineSchema = new mongoose.Schema({
  summer: {
    freeboard: { type: Number },
    draft: { type: Number },
    deadweight: { type: Number },
    displacement: { type: Number }
  },
  winter: {
    freeboard: { type: Number },
    draft: { type: Number },
    deadweight: { type: Number },
    displacement: { type: Number }
  },
  tropical: {
    freeboard: { type: Number },
    draft: { type: Number },
    deadweight: { type: Number },
    displacement: { type: Number }
  },
  airDraft: {
    summerDeadweight: { type: Number },
    normalBallast: { type: Number },
    lightship: { type: Number }
  }
}, { _id: false });

const certificateSchema = new mongoose.Schema({
  issued: { type: Date },
  lastAnnual: { type: Date },
  lastIntermediate: { type: Date },
  expires: { type: Date }
}, { _id: false });

const certificatesSchema = new mongoose.Schema({
  safetyEquipment: certificateSchema,
  safetyRadio: certificateSchema,
  safetyConstruction: certificateSchema,
  loadline: certificateSchema,
  oilPollutionPrevention: certificateSchema,
  shipSecurity: certificateSchema,
  maritimeLabour: certificateSchema,
  ismSafetyManagement: certificateSchema,
  documentOfCompliance: certificateSchema,
  uscgCertificateOfCompliance: certificateSchema,
  civilLiabilityConvention: certificateSchema,
  bunkerOilPollution: certificateSchema,
  liabilityForRemovalOfWrecks: certificateSchema,
  usCertificateOfFinancialResponsibility: certificateSchema,
  classOfCertificate: certificateSchema,
  sewagePollutionPrevention: certificateSchema,
  certificateOfFitness: certificateSchema,
  energyEfficiency: certificateSchema,
  airPollutionPrevention: certificateSchema
}, { _id: false });

const crewSchema = new mongoose.Schema({
  officers: {
    number: { type: Number },
    nationality: { type: String }
  },
  crew: {
    number: { type: Number },
    nationality: { type: String }
  },
  commonWorkingLanguage: { type: String },
  officersSpeakEnglish: { type: Boolean }
}, { _id: false });

const manifestSchema = new mongoose.Schema({
  totalNumber: { type: Number },
  size: { type: Number }, // in mm
  typeOfValves: { type: String },
  material: { type: String },
  rating: { type: String },
  distanceBetweenCenters: { type: Number }, // in mm
  distanceShipsRailToManifold: { type: Number }, // in mm
  distanceManifoldToShipsSide: { type: Number }, // in mm
  topOfRailToCenterManifold: { type: Number }, // in mm
  distanceMainDeckToCenterManifold: { type: Number }, // in mm
  spillTankGratingToCenterManifold: { type: Number }, // in mm
  heightAboveWaterlineNormalBallast: { type: Number }, // in m
  heightAboveWaterlineSDWT: { type: Number }, // in m
  reducers: { type: String }, // Description of reducers
  sternManifoldFitted: { type: Boolean },
  sternManifoldSize: { type: Number } // in mm
}, { _id: false });

const cargoTankSchema = new mongoose.Schema({
  number: { type: Number },
  totalCapacity: { type: Number }, // in m3
  naturalSegregations: [{
    name: { type: String },
    capacity: { type: Number },
    tanks: { type: String }
  }],
  centerlineBulkhead: {
    fitted: { type: Boolean },
    type: { type: String } // solid or perforated
  },
  slopTanks: {
    number: { type: Number },
    totalCapacity: { type: Number }, // in m3
    segregations: { type: String }
  },
  residualTankCapacity: { type: Number }, // in m3
  sbtCapacity: { type: Number }, // in m3
  sbtPercentage: { type: Number }, // % of SDWT
  meetsMARPOLRequirements: { type: Boolean },
  gradesLoadDischarge: { type: Number }, // How many grades can be loaded/discharged
  fillingRestrictions: { type: String },
  loadingRates: {
    withVECS: {
      perManifold: { type: Number }, // in m3/hr
      allManifolds: { type: Number } // in m3/hr
    },
    withoutVECS: {
      perManifold: { type: Number }, // in m3/hr
      allManifolds: { type: Number } // in m3/hr
    }
  },
  cargoControlRoom: { type: Boolean },
  ullageReadFromCCR: { type: Boolean }
}, { _id: false });

const cargoPumpSchema = new mongoose.Schema({
  maxSimultaneousPumps: { type: Number },
  pumps: [{
    type: { type: String },
    capacity: { type: Number }, // in m3/hr
    head: { type: Number } // in meters
  }],
  eductors: [{
    type: { type: String },
    capacity: { type: Number }, // in m3/hr
    head: { type: Number } // in meters
  }],
  stripping: [{
    type: { type: String },
    capacity: { type: Number }, // in m3/hr
    head: { type: Number } // in meters
  }],
  emergencyPortablePump: { type: Boolean }
}, { _id: false });

const heatingSchema = new mongoose.Schema({
  cargoTanks: {
    system: { type: String }, // e.g., "Heating coils"
    material: { type: String } // e.g., "SS"
  },
  slopTanks: {
    system: { type: String },
    material: { type: String }
  },
  maxTemperature: {
    load: { type: Number }, // in C
    maintain: { type: Number } // in C
  },
  minTemperature: {
    load: { type: Number }, // in C
    maintain: { type: Number } // in C
  }
}, { _id: false });

// Main Vessel Schema
const vesselSchema = new mongoose.Schema({
  // General Information
  dateUpdated: { type: Date, required: true },
  name: { type: String, required: true },
  imo: { type: String, required: true, unique: true, index: true },
  previousNames: [{ name: String, dateChanged: Date }],
  dateDelivered: { type: Date },
  builder: { type: String },
  flag: { type: String },
  portOfRegistry: { type: String },
  callSign: { type: String },
  mmsi: { type: String },
  contactDetails: {
    tel: { type: String },
    fax: { type: String },
    email: { type: String }
  },
  vesselType: { type: String }, // e.g., "Oil Tanker"
  hullType: { type: String }, // e.g., "Double Hull"
  
  // Ownership and Operation
  registeredOwner: ownerInfoSchema,
  technicalOperator: ownerInfoSchema,
  commercialOperator: ownerInfoSchema,
  disponentOwner: ownerInfoSchema,
  
  // Classification and Insurance
  classificationSociety: { type: String },
  classNotation: { type: String },
  subjectToConditionsOfClass: { type: Boolean },
  conditionsOfClassDetails: { type: String },
  previousClassificationSociety: { type: String },
  iceClass: { type: Boolean },
  iceClassLevel: { type: String },
  lastDryDock: { type: Date },
  lastDryDockPlace: { type: String },
  nextDryDockDue: { type: Date },
  nextAnnualSurveyDue: { type: Date },
  lastSpecialSurvey: { type: Date },
  nextSpecialSurveyDue: { type: Date },
  
  // Physical Characteristics
  dimensions: dimensionsSchema,
  tonnages: tonnagesSchema,
  loadline: loadlineSchema,
  
  // Certificates
  certificates: certificatesSchema,
  
  // Crew Information
  crew: crewSchema,
  
  // US Calls Information
  usCallsInfo: {
    vesselSpillResponsePlan: { type: Boolean },
    qualifiedIndividual: { type: String },
    oilSpillResponseOrganization: { type: String },
    salvageAndFirefighting: { type: String }
  },
  
  // Safety/Helicopter Information
  qualityManagementSystem: { type: Boolean },
  qmsType: { type: String },
  helicopterGuidelines: { type: Boolean },
  helicopterFacilities: {
    type: { type: String }, // "Winching" or "Landing"
    circleDiameter: { type: Number } // in meters
  },
  
  // Cargo and Tank Information
  cargoTanks: cargoTankSchema,
  cargoPumps: cargoPumpSchema,
  manifold: manifestSchema,
  heating: heatingSchema,
  inertGasSystem: {
    fitted: { type: Boolean },
    operational: { type: Boolean },
    suppliedBy: { type: String } // e.g., "Flue Gas"
  },
  crudeOilWashing: {
    fitted: { type: Boolean },
    operational: { type: Boolean }
  },
  
  // Additional Information
  ballastPumps: [{
    type: { type: String },
    capacity: { type: Number }, // in m3/hr
    head: { type: Number } // in meters
  }],
  ballastEductors: [{
    type: { type: String },
    capacity: { type: Number }, // in m3/hr
    head: { type: Number } // in meters
  }],
  
  // Metadata
  lastUpdated: { type: Date, default: Date.now },
  dataSource: { type: String, default: 'Q88' }
}, { timestamps: true });

// Create indexes for common query fields
vesselSchema.index({ name: 1 });
vesselSchema.index({ flag: 1 });
vesselSchema.index({ vesselType: 1 });
vesselSchema.index({ 'dimensions.deadweight': 1 });
vesselSchema.index({ 'cargoTanks.totalCapacity': 1 });

module.exports = mongoose.model('Vessel', vesselSchema); 