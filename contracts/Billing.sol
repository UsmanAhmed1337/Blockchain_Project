// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Billing {
    address public admin;
    address public insurer;

    struct Bill {
        uint serviceId;
        uint amount;
        bool isPaid;
    }

    mapping(uint => Bill) public bills;

    constructor(address _insurer) {
        admin = msg.sender;
        insurer = _insurer;
    }

    function addBill(uint serviceId, uint amount) public  {
        bills[serviceId] = Bill(serviceId, amount, false);
    }

    function payBill(uint serviceId) public  {
        Bill storage bill = bills[serviceId];
        bill.isPaid = true;
    }
}
