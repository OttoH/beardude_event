'use strict';

module.exports.policies = {
    EventController: {
      create: 'isActiveManager',
//    getEvents: '',
//    getInfo: '',
      update: 'isActiveManager',
      delete: 'isActiveManager'
    },
    GroupController: {
        create: 'isActiveManager',
//        getInfo: 'isActiveManager',
        update: 'isActiveManager',
        delete: 'isActiveManager'
    },
    ManagerController: {
//        activate: 'isInactive',
        create: 'isActiveManager',
//        getGeneralInfo: '',
        getManagers: 'isActiveManager',
        getManagementInfo: 'isActiveManager',
        login: 'isNotLoggedIn',
//        logout: '',
//        reissuePassword: ''
        update: 'isActiveManager',
        updatePassword: 'isActiveManager'
    },
    RaceController: {
        create: 'isActiveManager',
//        getGeneralInfo: '',
        getManagementInfo: 'isActiveManager',
        update: 'isActiveManager',
        delete: 'isActiveManager',
        assignRegsToRaces: 'isActiveManager',
        startRace: 'isActiveManager',
        resetRace: 'isActiveManager',
        endRace: 'isActiveManager',
        submitResult: 'isActiveManager',
        socketManagement: 'isActiveManager'
//      socket: '',
//      socketImpinj: ''
    },
    RacerController: {
//        activate: 'isInactive',
//        create: '',
//        getGeneralInfo: '',
        getRacers: 'isActiveManager',
        getManagementInfo: 'isRacerSelfOrTeamLeaderOrManager',
        login: 'isNotLoggedIn',
//        logout: '',
//        reissuePassword: ''
        update: 'isRacerSelfOrTeamLeaderOrManager',
        updatePassword: 'isRacerSelfOrTeamLeaderOrManager'
    },
    RegistrationController: {
//        createReg: 'isActiveManager',
//        signupAndCreate: '',
//        signupAndCreateMultiple: '',
//        create: '',
        getInfo: 'isRacerSelfOrTeamLeaderOrManager',
        confirmRegistration: 'isActiveManager',
        update: 'isActiveManager',
//        updateDisqualification: 'isActiveManager',
        updateRaceNote: 'isActiveManager',
        delete: 'isActiveManager'
    },
    TeamController: {
//        teamExist: '',
//        create: '',
//        getInfo: '',
        update: 'isTeamLeaderOrManager'
    }
};
