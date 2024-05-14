const SupplyChain = artifacts.require("SupplyChain");

contract("SupplyChain", accounts => {
    let supplyChain = null;
    const [admin, nonAdmin] = accounts;

    before(async () => {
        supplyChain = await SupplyChain.deployed();
    });

    describe("Management of items in the supply chain", () => {
        it("should allow admin to add an item", async () => {
            await supplyChain.addItem(1, "Item1", { from: admin });
            const item = await supplyChain.items(1);
            assert.equal(item.itemName, "Item1", "Item was not added correctly");
        });

        it("should not allow a non-admin to add an item", async () => {
            try {
                await supplyChain.addItem(2, "Item2", { from: nonAdmin });
                assert.fail("The transaction should have failed.");
            } catch (error) {
                assert.include(error.message, "revert", "Expected revert for non-admin adding item");
            }
        });

        it("should allow admin to mark an item as received", async () => {
            await supplyChain.markAsReceived(1, { from: admin });
            const item = await supplyChain.items(1);
            assert.equal(item.isReceived, true, "Item was not marked as received correctly");
        });

        it("should not allow non-admin to mark items as received", async () => {
            try {
                await supplyChain.markAsReceived(1, { from: nonAdmin });
                assert.fail("The transaction should have failed.");
            } catch (error) {
                assert.include(error.message, "revert", "Expected revert for non-admin marking item as received");
            }
        });
    });
});
