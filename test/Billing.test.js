const Billing = artifacts.require("Billing");

contract("Billing", accounts => {
    let billing = null;
    const [admin, insurer, nonAuthorized] = accounts;

    before(async () => {
        billing = await Billing.new(insurer, { from: admin }); // Deploying anew for each test to isolate cases
    });

    describe("Handling of bills and payments", () => {
        it("should allow admin or insurer to add a bill", async () => {
            await billing.addBill(1, 1000, { from: admin });
            const bill = await billing.bills(1);
            assert.equal(bill.amount.toNumber(), 1000, "Bill amount incorrect");

            await billing.addBill(2, 2000, { from: insurer });
            const bill2 = await billing.bills(2);
            assert.equal(bill2.amount.toNumber(), 2000, "Bill amount incorrect when added by insurer");
        });

        it("should not allow unauthorized users to add a bill", async () => {
            try {
                await billing.addBill(3, 1500, { from: nonAuthorized });
                assert.fail("The transaction should have failed.");
            } catch (error) {
                assert.include(error.message, "revert", "Expected revert for non-authorized adding bill");
            }
        });

        it("should allow payment of bills by admin or insurer", async () => {
            await billing.payBill(1, { from: admin });
            const bill = await billing.bills(1);
            assert.equal(bill.isPaid, true, "Bill was not marked as paid by admin");

            await billing.payBill(2, { from: insurer });
            const bill2 = await billing.bills(2);
            assert.equal(bill2.isPaid, true, "Bill was not marked as paid by insurer");
        });

        it("should not allow unauthorized users to pay bills", async () => {
            try {
                await billing.payBill(1, { from: nonAuthorized });
                assert.fail("The transaction should have failed.");
            } catch (error) {
                assert.include(error.message, "revert", "Expected revert for non-authorized paying bill");
            }
        });
    });
});
