var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

var abi = [
  {
    'constant': true,
    'inputs': [],
    'name': 'getQueuesAddresses',
    'outputs': [
      {
        'name': '',
        'type': 'address[]'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': '',
        'type': 'address'
      }
    ],
    'name': 'mapQueues',
    'outputs': [
      {
        'name': 'mDesc',
        'type': 'bytes32'
      },
      {
        'name': 'mTitle',
        'type': 'bytes32'
      },
      {
        'name': 'mOwnerAddress',
        'type': 'address'
      },
      {
        'name': 'mQueueAddress',
        'type': 'address'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'queueAddress',
        'type': 'address'
      }
    ],
    'name': 'kill',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'title',
        'type': 'bytes32'
      },
      {
        'name': 'desc',
        'type': 'bytes32'
      },
      {
        'name': 'freeToEnter',
        'type': 'bool'
      },
      {
        'name': 'data',
        'type': 'bytes32'
      }
    ],
    'name': 'createQueue',
    'outputs': [
      {
        'name': '',
        'type': 'address'
      }
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }
]
var address = '0xcD26d77ec5023846462131ED0fBf949dDe506aAC'
var contract = new web3.eth.Contract(abi, address)

// contract.methods.getQueuesAddresses().call().then(console.log)

var createQueue = function (title, desc, freeToEnter, data) {
  contract.methods
    .createQueue(web3.utils.asciiToHex(title), web3.utils.asciiToHex(desc), freeToEnter, web3.utils.asciiToHex(data))
    .send({ from: '0x00ce9F958957f1f8A0059f36004f8aF9E4814006' })
    .once('transactionHash', function (hash) { console.log('transactionHash ', hash) })
    .once('receipt', function (receipt) { console.log('receipt ', receipt) })
    .on('confirmation', function (confNumber, receipt) { console.log('confNumber %s, receipt ', confNumber, receipt) })
    .on('error', function (error) { console.log('primljen error ', error) })
    .then(function (receipt) {
      // will be fired once the receipt its mined
      console.log('then receipt ', receipt)
    })
}

exports.createQueue = createQueue
