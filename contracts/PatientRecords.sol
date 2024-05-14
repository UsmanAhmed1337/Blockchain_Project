// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatientRecords {
    address public admin;

    struct Record {
        uint id;
        string diagnosis;
        string treatmentPlan;
        uint lastUpdated;
    }

    mapping(uint => Record) public records; // maps a patient ID to a Record
    mapping(address => bool) public doctors; // authorized doctors

    constructor() {
        admin = msg.sender;
    }

    function addDoctor(address doctor) public  {
        doctors[doctor] = true;
    }

    function removeDoctor(address doctor) public  {
        doctors[doctor] = false;
    }

    function addOrUpdateRecord(uint patientId, string memory diagnosis, string memory treatmentPlan) public  {
        records[patientId] = Record(patientId, diagnosis, treatmentPlan, block.timestamp);
    }

    function getRecord(uint patientId) public view  returns (Record memory) {
        return records[patientId];
    }
}
