import {deepmerge} from "deepmerge-ts";

const addressDetails = {
  icon: 'mdi-home-circle',
  schema: 'addressDetails',
  fields: {
    streetNumber: {props: {autocomplete: 'off'}},
    route: {props: {autocomplete: 'off'}},
    locality: {props: {autocomplete: 'off'}},
    postalTown: {props: {autocomplete: 'off'}},
    administrativeAreaLevel2: {props: {autocomplete: 'off'}},
    country: {
      component: 'SelectField',
      props: {
        itemsReference: ['lists.commonCountries', 'lists.countries'],
        type: 'autocomplete'
      }
    },
    postalCode: {props: {autocomplete: 'off'}},
  }
}
const datedAddressDetails = deepmerge(addressDetails, {
  schema: 'datedAddressDetails',
  fields: {
    fromDate: {
      component: 'InputField',
      props: {
        type: 'date',
        max: new Date()
      }
    }
  }
})

const nameDetails = {
  icon: 'mdi-account-circle',
  schema: 'nameDetails',
  fields: {
    title: {
      props: {itemsReference: 'lists.titles'},
      component: 'SelectField',
    },
    firstName: {},
    middleName: {},
    lastName: {},
    fromDate: {
      component: 'InputField',
      props: {
        type: 'date',
        max: new Date()
      }
    },
    toDate: {
      component: 'InputField',
      props: {
        type: 'date',
        max: new Date()
      }
    }
  }
}

const applicantDetails = {
  icon: 'mdi-account-circle',
  fields: {
    title: {
      props: {itemsReference: 'lists.titles'},
      component: 'SelectField',
    },
    firstName: {},
    hasMiddleName: {
      component: 'RadioField'
    },
    middleName: {
      props: {
        reveal: (application: { hasMiddleName: boolean }) => {
          return application.hasMiddleName === true
        }
      }
    },
    lastName: {},
    hasNameHistory: {
      component: 'RadioField'
    },
    previousNameHistory: {
      component: 'NameHistoryField',
      props: {
        form: nameDetails,
        reveal: (application: { hasNameHistory: boolean }) => {
          return application.hasNameHistory === true
        }
      }
    }
  }
}

const birthDetails = {
  icon: 'mdi-cake-variant',
  fields: {
    gender: {
      props: {itemsReference: 'lists.genders'},
      component: 'SelectField'
    },
    dob: {
      component: 'InputField',
      props: {
        type: 'date',
        max: new Date()
      }
    },
    townOfBirth: {},
    countryOfBirth: {
      component: 'SelectField',
      props: {
        itemsReference: ['lists.commonCountries', 'lists.countries'],
        type: 'autocomplete'
      }
    },
    nationalityAtBirth: {
      component: 'SelectField',
      props: {type: 'autocomplete', itemsReference: ['lists.commonNationalities', 'lists.nationalities']},
    },
    currentNationality: {
      component: 'SelectField',
      props: {type: 'autocomplete', itemsReference: ['lists.commonNationalities', 'lists.nationalities']},
    },
    mothersMaidenName: {},
  }
}

const organisationDetails = {
  icon: 'mdi-office-circle',
  fields: {
    organisationName: {},
    organisationAddress: {
      component: 'AddressHistoryField',
      props: {
        form: addressDetails,
      }
    },
  }
}

const addressHistory = {
  icon: 'mdi-home-circle',
  fields: {
    addressHistory: {
      component: 'AddressHistoryField',
      props: {
        form: datedAddressDetails,
      }
    },
  }
}

const additionalInfoDetails = {
  icon: 'mdi-information',
  fields: {
    hasPassport: {
      component: 'RadioField'
    },
    passportNumber: {
      props: {
        reveal: (application: { hasPassport: boolean }) => {
          return application.hasPassport === true
        }
      }
    },
    passportDob: {
      props: {
        type: 'date',
        reveal: (application: { hasPassport: boolean }) => {
          return application.hasPassport === true
        }
      }
    },
    passportCountryOfIssue: {
      component: 'SelectField',
      props: {
        itemsReference: ['lists.commonCountries', 'lists.countries'],
        type: 'autocomplete',
        reveal: (application: { hasPassport: boolean }) => {
          return application.hasPassport === true
        }
      }
    },
    passportNationality: {
      component: 'SelectField',
      props: {
        type: 'autocomplete', itemsReference: ['lists.commonNationalities', 'lists.nationalities'],
        reveal: (application: { hasPassport: boolean }) => {
          return application.hasPassport === true
        }
      },
    },
    passportIssueDate: {
      component: 'InputField',
      props: {
        type: 'date',
        max: new Date(), reveal: (application: { hasPassport: boolean }) => {
          return application.hasPassport === true
        }
      }
    },
    hasDrivingLicence: {
      component: 'RadioField'
    },
    drivingLicenceNumber: {
      props: {
        reveal: (application: { hasDrivingLicence: boolean }) => {
          return application.hasDrivingLicence === true
        }
      },
    },
    drivingLicenceDob: {
      props: {
        type: 'date',
        reveal: (application: { hasDrivingLicence: boolean }) => {
          return application.hasDrivingLicence === true
        }
      },
    },
    drivingLicenceValidFromDate: {
      props: {
        type: 'date',
        reveal: (application: { hasDrivingLicence: boolean }) => {
          return application.hasDrivingLicence === true
        }
      },
    },
    drivingLicenceType: {
      component: 'RadioField',
      props: {
        options: [
          {label: 'paper', value: 'paper'},
          {label: 'card', value: 'card'}
        ],
        reveal: (application: { hasDrivingLicence: boolean }) => {
          return application.hasDrivingLicence === true
        }
      },
    },
    drivingLicenceCountryOfIssue: {
      component: 'SelectField',
      props: {
        itemsReference: ['lists.commonCountries', 'lists.countries'],
        type: 'autocomplete',
        reveal: (application: { hasDrivingLicence: boolean }) => {
          return application.hasDrivingLicence === true
        }
      }
    },

    dbsProfileNumber: {},
  }
}
const confirmationDetails = {
  icon: 'mdi-check-circle',
  fields: {
    electronicResults: {
      component: 'CheckboxField'
    },
    declaration: {
      component: 'CheckboxField'
    }
  }
}
const positionDetails = {
  icon: 'mdi-check-circle',
  fields: {
    positionAppliedFor: {
      component: 'SelectField',
      props: {
        itemsReference: 'lists.positions',
        type: 'autocomplete'
      }
    },
    jobDescription: {
      props: {
        type: 'textarea',
      }
    },
    contractualAgreement: {
      component: 'CheckboxField'
    },
    eligibilityGuidelines: {
      component: 'CheckboxField'
    },
    dbsGuidelines: {
      component: 'CheckboxField'
    },
    dbsCodeOfConduct: {
      component: 'CheckboxField'
    },
    dbsIdentityCheckingGuidelines: {
      component: 'CheckboxField'
    }
  }
}

const basicAdditionalInfoDetails = deepmerge({}, additionalInfoDetails, {
  fields: {
    passportDob: {props: {hidden: true}},
    passportNationality: {props: {hidden: true}},
    passportIssueDate: {props: {hidden: true}}
  }
})

export default defineAppConfig({
  googleMapsApiKey: 'AIzaSyDuHCycrOUqB1PEnzTVSXSfEofuwuM31Ig',

  applicationTypes: {
    basic: {
      forms: {
        applicantDetails,
        birthDetails,
        addressHistory,
        additionalInfoDetails: basicAdditionalInfoDetails,
        confirmationDetails
      }
    },
    standard: {
      forms: {
        positionDetails,
        organisationDetails,
        applicantDetails,
        birthDetails,
        addressHistory,
        additionalInfoDetails,
        confirmationDetails
      },
    }
  },
})