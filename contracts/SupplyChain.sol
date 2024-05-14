// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    address public admin;

    struct Item {
        uint itemId;
        string itemName;
        bool isReceived;
    }

    mapping(uint => Item) public items;

    constructor() {
        admin = msg.sender;
    }

    function addItem(uint itemId, string memory itemName) public  {
        items[itemId] = Item(itemId, itemName, false);
    }

    function markAsReceived(uint itemId) public  {
        Item storage item = items[itemId];
        item.isReceived = true;
    }
}
