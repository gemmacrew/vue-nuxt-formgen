const addressHistory = {
  icon: 'mdi-home-circle',
  schema: 'addressHistory',
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
    fromDate: {
      component: 'InputField',
      props: {
        type: 'date',
        max: new Date()
      }
    }
  }
}
const nameHistory = {
  icon: 'mdi-account-circle',
  schema: 'nameHistory',
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
    email: {
      props: {disabled: true},
    },
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
        reveal: (application: { hasMiddleName: string }) => {
          return application.hasMiddleName === 'true'
        }
      }
    },
    lastName: {},
    hasNameHistory: {
      component: 'RadioField'
    },
    previousNames: {
      component: 'NameHistoryField',
      props: {
        form: nameHistory,
        reveal: (application: { hasNameHistory: string }) => {
          return application.hasNameHistory === 'true'
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
const addressHistoryDetails = {
  icon: 'mdi-home-circle',
  fields: {
    addressHistory: {
      component: 'AddressHistoryField',
      props: {
        form: addressHistory,
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
    passportDetails: {
      component: 'FieldSet',
      props: {
        fields: {
          passportNumber: {},
          passportCountryOfIssue: {
            component: 'SelectField',
            props: {
              itemsReference: ['lists.commonCountries', 'lists.countries'],
              type: 'autocomplete'
            }
          },
        },
        reveal: (application: { hasPassport: string }) => {
          return application.hasPassport === 'true'
        }
      }
    },
    hasDrivingLicence: {
      component: 'RadioField'
    },
    drivingLicenceDetails: {
      component: 'FieldSet',
      props: {
        fields: {
          drivingLicenceNumber: {},
        },
        reveal: (application: { hasDrivingLicence: string }) => {
          return application.hasDrivingLicence === 'true'
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

export default defineAppConfig({
  googleMapsApiKey: 'AIzaSyDuHCycrOUqB1PEnzTVSXSfEofuwuM31Ig',

  /**
   * correspond to the steps in the stepper window
   */
  applicationForms: {
    applicantDetails,
    birthDetails,
    addressHistoryDetails,
    additionalInfoDetails,
    confirmationDetails,
    addressHistory,
    nameHistory
  },

  /**
   * a form represents a single validatable schema e.g. basicApplication, standardApplication, nameHistory
   */
  applicationTypes: {
    basic: {
      forms: {
        applicantDetails,
        birthDetails,
        addressHistoryDetails,
        additionalInfoDetails,
        confirmationDetails
      }
    },
    standard: {
      forms: {
        applicantDetails,
        nameHistory,
        confirmationDetails
      },
    }
  },
})