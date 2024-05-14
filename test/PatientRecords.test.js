const PatientRecords = artifacts.require("PatientRecords");

contract("PatientRecords", accounts => {
    let patientRecords = null;
    const [admin, doctor, other] = accounts;

    console.log(admin);

    before(async () => {
        patientRecords = await PatientRecords.deployed();
        // Set 'doctor' as an authorized doctor
        await patientRecords.addDoctor(doctor, { from: admin });
    });

    describe("Add or update records", () => {
        it("should add a new record", async () => {
            await patientRecords.addOrUpdateRecord(1, "Diagnosis", "Treatment", { from: admin });
            const record = await patientRecords.getRecord(1);
            assert.equal(record.diagnosis, "Diagnosis", "Diagnosis does not match");
            assert.equal(record.treatmentPlan, "Treatment", "Treatment plan does not match");
        });

        it("should not allow unauthorized users to add or update records", async () => {
            try {
                await patientRecords.addOrUpdateRecord(2, "Fake Diagnosis", "Fake Treatment", { from: other });
                assert.fail("The transaction should have failed.");
            } catch (error) {
                assert.include(error.message, "revert", "The error message should contain 'revert'");
            }
        });
    });

    describe("Access control", () => {
        it("only admin can add a doctor", async () => {
            try {
                await patientRecords.addDoctor(other, { from: other });
                assert.fail("The transaction should have failed.");
            } catch (error) {
                assert.include(error.message, "revert", "The error message should contain 'revert'");
            }
        });

        it("admin should be able to add a doctor", async () => {
            await patientRecords.addDoctor(other, { from: admin });
            const isDoctor = await patientRecords.doctors(other);
            assert.equal(isDoctor, true, "Doctor should be added by admin");
        });
    });
});
