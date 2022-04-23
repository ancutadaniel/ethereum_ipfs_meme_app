import React, { useEffect, useState } from 'react';
import getWeb3 from './utils/getWeb3';
import { create } from 'ipfs-http-client';

import Meme from '../src/build/abi/Meme.json';
import MainMenu from './components/Menu';
import { Button, Container, Form, Divider, Image } from 'semantic-ui-react';

const App = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState({});
  const [web3, setWeb3] = useState({});

  const [bufferFile, setBufferFile] = useState(null);
  const [ipfsHasH, setIpfsHash] = useState('');

  const url = `https://ipfs.infura.io/ipfs/`;

  // connect to Infura IPFS API address
  const ipfs = create({
    host: 'ipfs.infura.io',
    port: '5001',
    protocol: 'https',
  });

  const loadWeb3 = async () => {
    try {
      const web3 = await getWeb3();
      if (web3) {
        const getAccounts = await web3.eth.getAccounts();
        // get networks id of deployed contract
        const getNetworkId = await web3.eth.net.getId();
        // get contract data on this network
        const memeData = await Meme.networks[getNetworkId];
        // check contract deployed networks
        if (memeData) {
          // get contract deployed address
          const contractAddress = memeData.address;
          // create a new instance of the contract - on that specific address
          const contractData = await new web3.eth.Contract(
            Meme.abi,
            contractAddress
          );
          // read ipfsHash from blockchain
          const readHashData = await contractData.methods.readHash().call();
          setContract(contractData);
          setIpfsHash(readHashData);
        } else {
          alert('Smart contract not deployed to selected network');
        }
        setWeb3(web3);
        setAccounts(getAccounts);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpload = (e) => {
    // log upload file
    // console.log(e.target.files[0]);
    // set file
    const file = e.target.files[0];
    // create reader - for this file
    const reader = new FileReader();
    // create the array buffer for IPFS
    reader.readAsArrayBuffer(file);
    // Success
    reader.onload = () => setBufferFile(Buffer(reader.result));
    // Error
    reader.onerror = () => console.log(reader.error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // we add the array buffer to the IPFS
      const data = await ipfs.add(bufferFile);
      if (data) {
        // handle the response
        handleHash(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleHash = async (data) => {
    const { path } = data;
    try {
      // we use send when write data on blockchain && call when we just read
      await contract.methods.writeHash(path).send({ from: accounts[0] });
      const readHashData = await contract.methods.readHash().call();
      // we update new hash
      setIpfsHash(readHashData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadWeb3();
  }, []);

  return (
    <div className='App'>
      <MainMenu account={accounts[0]} />
      {ipfsHasH && (
        <Image src={`${url}${ipfsHasH}`} size='medium' bordered centered />
      )}
      <Divider horizontal>§</Divider>
      <Container>
        <Form onSubmit={handleSubmit} loading={loading}>
          <Form.Input
            label='Upload Meme'
            placeholder='Upload Meme'
            name='meme'
            type='file'
            onChange={handleUpload}
            required
          />
          <Button color='purple' type='submit'>
            Submit
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default App;
