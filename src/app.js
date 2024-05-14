const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { Web3 } = require('web3');
const { User} = require('./models/user');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Web3 and contract setup
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_URL));
const patientRecordsABI = require('../build/contracts/PatientRecords.json').abi;
const supplyChainABI = require('../build/contracts/SupplyChain.json').abi;
const billingABI = require('../build/contracts/Billing.json').abi;

const patientRecordsAddress = '0x96eea271F1D097F44f57B4Ee58213a8708887c74';
const supplyChainAddress = '0xe724230322E27DC31DCae77012102BFbBA655513';
const billingAddress = '0x2F86A8625c6d260E00C3E4A712F355D3F26Fa6b2';

const patientRecordsContract = new web3.eth.Contract(patientRecordsABI, patientRecordsAddress);
const supplyChainContract = new web3.eth.Contract(supplyChainABI, supplyChainAddress);
const billingContract = new web3.eth.Contract(billingABI, billingAddress);

// Endpoint to add or update patient records
app.post('/patientRecords/addOrUpdate', async (req, res) => {
    const { patientId, diagnosis, treatmentPlan } = req.body;
    try {
        const accounts = await web3.eth.getAccounts();
        const result = await patientRecordsContract.methods.addOrUpdateRecord(patientId, diagnosis, treatmentPlan).send({ from: accounts[0], gas: 500000 });
        res.json({ message: 'Record updated successfully', transactionHash: result.transactionHash });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update record', error: error.toString() });
    }
});

// Endpoint to retrieve a patient record
app.get('/patientRecords/:patientId', async (req, res) => {
    const patientId = req.params.patientId;
    try {
        const record = await patientRecordsContract.methods.getRecord(patientId).call();
        res.json(record);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve record', error: error.toString() });
    }
});

// Endpoint to add an item to the supply chain
app.post('/supplyChain/addItem', async (req, res) => {
    const { itemId, itemName } = req.body;
    try {
        const accounts = await web3.eth.getAccounts();
        const result = await supplyChainContract.methods.addItem(itemId, itemName).send({ from: accounts[0] });
        res.json({ message: 'Item added successfully', transactionHash: result.transactionHash });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add item', error: error.toString() });
    }
});

// Endpoint to mark an item as received in the supply chain
app.post('/supplyChain/receiveItem', async (req, res) => {
    const { itemId } = req.body;
    try {
        const accounts = await web3.eth.getAccounts();
        const result = await supplyChainContract.methods.markAsReceived(itemId).send({ from: accounts[0] });
        res.json({ message: 'Item marked as received successfully', transactionHash: result.transactionHash });
    } catch (error) {
        res.status(500).json({ message: 'Failed to mark item as received', error: error.toString() });
    }
});

// Endpoint to add a bill
app.post('/billing/addBill', async (req, res) => {
    const { serviceId, amount } = req.body;
    try {
        const accounts = await web3.eth.getAccounts();
        const result = await billingContract.methods.addBill(serviceId, amount).send({ from: accounts[0] });
        res.json({ message: 'Bill added successfully', transactionHash: result.transactionHash });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add bill', error: error.toString() });
    }
});

// Endpoint to pay a bill
app.post('/billing/payBill', async (req, res) => {
    const { serviceId } = req.body;
    try {
        const accounts = await web3.eth.getAccounts();
        const result = await billingContract.methods.payBill(serviceId).send({ from: accounts[0] });
        res.json({ message: 'Bill paid successfully', transactionHash: result.transactionHash });
    } catch (error) {
        res.status(500).json({ message: 'Failed to pay bill', error: error.toString() });
    }
});

app.get('/', (req, res) => {
    res.send({message:"Hello World!"})
});

app.post('/signup', async (req, res) => {
    try {
      const newUser = new User({
        username: req.body.username,
        password: req.body.password,
      });
  
      await newUser.save();
    } catch (error) {
      console.log(error);
    }
});

app.post('/login', async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      const pass = await User.findOne({ password: req.body.password });
      if (user && pass) {
        console.log('Logged In!')
      } else {
        console.log('Incorrect username or password')
      }
    } catch (error) {
      console.log(error);
    }
});
  

// Listen on a port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

