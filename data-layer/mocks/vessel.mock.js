/**
 * Mock data generator for vessel data
 * Used for development and testing purposes
 */

// Sample vessel data based on Q88 structure
const mockVessels = [
  {
    dateUpdated: new Date('2023-07-23'),
    name: 'Torm Maren',
    imo: '9358400',
    previousNames: [],
    dateDelivered: new Date('2008-08-18'),
    builder: 'Dalian Shipbuilding Industri Co. Ltd',
    flag: 'Denmark',
    portOfRegistry: 'København',
    callSign: 'OULI2',
    mmsi: '220602000',
    contactDetails: {
      tel: '+ 870 773 236 049 / Vsat + 45 898 836 18',
      fax: '+870 783 209 404',
      email: 'master@maren.tormvessels.com'
    },
    vesselType: 'Oil Tanker',
    hullType: 'Double Hull',
    
    registeredOwner: {
      name: 'Torm A/S',
      address: 'Tuborg Havnevej 18, DK-2900, Hellerup, Denmark',
      country: 'Denmark',
      tel: '+45 3917 9200',
      fax: '+45 3917 9124',
      telex: '+55 22315 torm dk',
      email: 'vetting@torm.com',
      website: 'www.torm.com'
    },
    
    technicalOperator: {
      name: 'TORM A/S',
      address: 'Tuborg Havnevej 18, DK-2900,Hellerup',
      country: 'Denmark',
      tel: '+45 39 17 92 00',
      fax: '+45 39179124',
      telex: '+ 55 22315 torm dk',
      email: 'vetting@torm.com',
      website: 'www.torm.com',
      companyIMO: '0310062'
    },
    
    classificationSociety: 'Lloyds Register',
    classNotation: '+100A1 Double Hull Oil Tanker, ESP, ShipRight, (FDA,SDA,CM),*IWS,SPM,LI, +LMC,UMS,IGS, EGCS(Open, Partial)',
    subjectToConditionsOfClass: false,
    iceClass: false,
    lastDryDock: new Date('2023-05-26'),
    lastDryDockPlace: 'Zhoushan',
    nextDryDockDue: new Date('2026-05-26'),
    nextAnnualSurveyDue: new Date('2024-11-17'),
    lastSpecialSurvey: new Date('2023-06-04'),
    nextSpecialSurveyDue: new Date('2028-08-17'),
    
    dimensions: {
      lengthOverall: 244.60,
      lengthBetweenPerpendiculars: 233.00,
      beam: 42.00,
      mouldedDepth: 22.20,
      keelToMasthead: 51.0,
      bridgeFrontToManifold: 80.80,
      bowToCenterManifold: 121.80,
      sternToCenterManifold: 122.80,
      parallelBody: {
        lightship: {
          forwardToMidPointManifold: 62,
          aftToMidPointManifold: 25.00,
          length: 87.50
        },
        normalBallast: {
          forwardToMidPointManifold: 68.80,
          aftToMidPointManifold: 49.60,
          length: 118.40
        },
        summerDwt: {
          forwardToMidPointManifold: 73.60,
          aftToMidPointManifold: 62.50,
          length: 136.10
        }
      }
    },
    
    tonnages: {
      net: 32744.00,
      gross: 62084.00,
      reducedGross: 48168,
      suezCanalGross: 64919.68,
      suezCanalNet: 58785.54,
      panamaCanalNet: 0.00
    },
    
    loadline: {
      summer: {
        freeboard: 7.766,
        draft: 14.462,
        deadweight: 99995.00,
        displacement: 120010.00
      },
      winter: {
        freeboard: 7.766,
        draft: 14.462,
        deadweight: 99995.00,
        displacement: 120010.00
      },
      tropical: {
        freeboard: 7.766,
        draft: 14.462,
        deadweight: 99995.00,
        displacement: 120010.00
      },
      airDraft: {
        summerDeadweight: 36.338,
        normalBallast: 42.09,
        lightship: 48.11
      }
    },
    
    certificates: {
      safetyEquipment: {
        issued: new Date('2023-06-04'),
        expires: new Date('2028-08-17')
      },
      safetyRadio: {
        issued: new Date('2023-06-04'),
        expires: new Date('2028-08-17')
      },
      safetyConstruction: {
        issued: new Date('2023-06-04'),
        expires: new Date('2028-08-17')
      },
      loadline: {
        issued: new Date('2023-06-04'),
        expires: new Date('2028-08-17')
      },
      oilPollutionPrevention: {
        issued: new Date('2023-06-04'),
        expires: new Date('2028-08-17')
      }
    },
    
    crew: {
      officers: {
        number: 9,
        nationality: 'Indian'
      },
      crew: {
        number: 11,
        nationality: 'Filipinos'
      },
      commonWorkingLanguage: 'English',
      officersSpeakEnglish: true
    },
    
    usCallsInfo: {
      vesselSpillResponsePlan: true,
      qualifiedIndividual: 'Gallagher Marine Systems Inc',
      oilSpillResponseOrganization: 'National Response Corporation',
      salvageAndFirefighting: 'Resolve Marine'
    },
    
    qualityManagementSystem: true,
    qmsType: 'IMO Resolution A.741(18)',
    helicopterGuidelines: true,
    helicopterFacilities: {
      type: 'Winching',
      circleDiameter: 5.00
    },
    
    cargoTanks: {
      centerlineBulkhead: {
        fitted: true,
        type: 'Solid'
      },
      number: 12,
      totalCapacity: 117936.60,
      naturalSegregations: [
        {
          name: 'Seg#1',
          capacity: 40904.4,
          tanks: 'No.1 COT(P&S), No.4 COT(P&S), Slop (P&S)'
        },
        {
          name: 'Seg#2',
          capacity: 40924.99,
          tanks: 'No.2 COT(P&S), No.5 COT(P&S)'
        },
        {
          name: 'Seg#3',
          capacity: 39943.43,
          tanks: 'No.3 COT(P&S), No.6 COT(P&S)'
        }
      ],
      slopTanks: {
        number: 2,
        totalCapacity: 3836.20,
        segregations: 'Slop (P) belongs to Seg 1, Capacity Slop (P) - 1918.1 m3, Slop (S) belongs to Seg 1, Capacity Slop (S) - 1918.1 m3'
      },
      residualTankCapacity: 282.53,
      sbtCapacity: 45023.10,
      sbtPercentage: 44.98,
      meetsMARPOLRequirements: true,
      gradesLoadDischarge: 3,
      fillingRestrictions: 'Cargo tanks are suitable for unrestricted filling upto 98% for specific gravity upto 1.025 t/m3',
      loadingRates: {
        withVECS: {
          perManifold: 5318,
          allManifolds: 15955
        },
        withoutVECS: {
          perManifold: 5318,
          allManifolds: 15955.00
        }
      },
      cargoControlRoom: true,
      ullageReadFromCCR: true
    },
    
    manifold: {
      totalNumber: 3,
      size: 400.00,
      typeOfValves: 'Manual',
      material: 'steel ANSI150',
      rating: '150 ANSI',
      distanceBetweenCenters: 2500.00,
      distanceShipsRailToManifold: 4450.00,
      distanceManifoldToShipsSide: 4600.00,
      topOfRailToCenterManifold: 760.00,
      distanceMainDeckToCenterManifold: 2100.00,
      spillTankGratingToCenterManifold: 900.00,
      heightAboveWaterlineNormalBallast: 16.06,
      heightAboveWaterlineSDWT: 9.538,
      reducers: '4 x 400/300mm (16/12"), 4 x 400/250mm (16/10"), 4 x 400/200mm (16/8"), 2 x 300/200mm (12/8"), 1 x 200/150mm (8/6"), 1 x 200/100mm (8/4")',
      sternManifoldFitted: false
    },
    
    heating: {
      cargoTanks: {
        system: 'Heating coils',
        material: 'SS'
      },
      slopTanks: {
        system: 'Heating coils',
        material: 'SS'
      },
      maxTemperature: {
        load: 65.0,
        maintain: 66.0
      }
    },
    
    inertGasSystem: {
      fitted: true,
      operational: true,
      suppliedBy: 'Flue Gas'
    },
    
    crudeOilWashing: {
      fitted: true,
      operational: true
    },
    
    cargoPumps: {
      maxSimultaneousPumps: 3,
      pumps: [
        {
          type: 'Centrifugal',
          capacity: 3000,
          head: 130
        },
        {
          type: 'Centrifugal',
          capacity: 3000,
          head: 130
        },
        {
          type: 'Centrifugal',
          capacity: 3000,
          head: 130
        }
      ],
      eductors: [
        {
          type: 'Other',
          capacity: 300,
          head: 25
        },
        {
          type: 'Other',
          capacity: 300,
          head: 25
        }
      ],
      stripping: [
        {
          type: 'Reciprocating',
          capacity: 100,
          head: 130
        }
      ],
      emergencyPortablePump: false
    },
    
    ballastPumps: [
      {
        type: 'Centrifugal',
        capacity: 2000,
        head: 25
      },
      {
        type: 'Centrifugal',
        capacity: 2000,
        head: 25
      }
    ],
    
    ballastEductors: [
      {
        type: 'Other',
        capacity: 125,
        head: 27
      }
    ],
    
    dataSource: 'Q88'
  },
  // Add more mock vessels here if needed
];

/**
 * Get mock vessel data
 * @param {number} count - Number of vessels to generate
 * @returns {Array} - Array of mock vessel data
 */
const getMockVessels = (count = 1) => {
  if (count === 1) {
    return mockVessels[0];
  }
  
  // If we need more than we have, duplicate with slight modifications
  if (count > mockVessels.length) {
    const additionalVessels = [];
    for (let i = 0; i < count - mockVessels.length; i++) {
      const sourceVessel = mockVessels[i % mockVessels.length];
      const vesselCopy = JSON.parse(JSON.stringify(sourceVessel));
      
      // Modify some properties to make it unique
      vesselCopy.name = `${sourceVessel.name} ${i + mockVessels.length + 1}`;
      vesselCopy.imo = `${parseInt(sourceVessel.imo) + i + mockVessels.length + 1}`;
      vesselCopy.callSign = `${sourceVessel.callSign}${i + mockVessels.length + 1}`;
      
      additionalVessels.push(vesselCopy);
    }
    return [...mockVessels, ...additionalVessels].slice(0, count);
  }
  
  return mockVessels.slice(0, count);
};

module.exports = {
  getMockVessels
}; 