var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

var abi = [
  {
    'constant': true,
    'inputs': [
      {
        'name': 'index',
        'type': 'uint256'
      }
    ],
    'name': 'getClientAtIndex',
    'outputs': [
      {
        'name': '',
        'type': 'address'
      },
      {
        'name': '',
        'type': 'uint256'
      },
      {
        'name': '',
        'type': 'bytes32'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [],
    'name': 'kill',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [],
    'name': 'popClient',
    'outputs': [
      {
        'name': '',
        'type': 'address'
      },
      {
        'name': '',
        'type': 'uint256'
      },
      {
        'name': '',
        'type': 'bytes32'
      }
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'clientAddress',
        'type': 'address'
      },
      {
        'name': 'userData',
        'type': 'bytes32'
      }
    ],
    'name': 'pushClient',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'getNumberOfClients',
    'outputs': [
      {
        'name': '',
        'type': 'uint256'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'name': 'tit',
        'type': 'bytes32'
      },
      {
        'name': 'desc',
        'type': 'bytes32'
      },
      {
        'name': 'isFreeToEnter',
        'type': 'bool'
      },
      {
        'name': 'dat',
        'type': 'bytes32'
      },
      {
        'name': 'creatorAddress',
        'type': 'address'
      }
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'constructor'
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'name': 'cliendAddress',
        'type': 'address'
      },
      {
        'indexed': false,
        'name': 'data',
        'type': 'bytes32'
      }
    ],
    'name': 'ClientAdded',
    'type': 'event'
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'name': 'clientAddress',
        'type': 'address'
      },
      {
        'indexed': false,
        'name': 'timestamp',
        'type': 'uint256'
      },
      {
        'indexed': false,
        'name': 'data',
        'type': 'bytes32'
      }
    ],
    'name': 'ClientRemoved',
    'type': 'event'
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'name': 'queueAddress',
        'type': 'address'
      }
    ],
    'name': 'QueueKilled',
    'type': 'event'
  }
]
var address = '0xd04967986E36b7310D10Cda443847a31660521A7'
var contract = new web3.eth.Contract(abi, address)

var pushClient = function (userData) {
  var address = web3.utils.randomHex(20)
  contract.methods
    .pushClient(address, web3.utils.asciiToHex(userData))
    .send({ from: '0x00ce9F958957f1f8A0059f36004f8aF9E4814006' })
    .then(function (receipt) {
      // will be fired once the receipt its mined
      console.log('receipt ', receipt)
      // event ClientAdded(address cliendAddress, bytes32 data);
      console.log('cliendAddress ', receipt.events.ClientAdded.returnValues.cliendAddress)
      console.log('data ', web3.utils.hexToAscii(receipt.events.ClientAdded.returnValues.data))
    })
}

// var popClient = function () {
//   var address = web3.utils.randomHex(20)
//   contract.methods.popClient()
//     .send({ from: '0x00ce9F958957f1f8A0059f36004f8aF9E4814006' })
//     // .on('ClientAdded', function (clientAddress, userData) { console.log('ClientAdded: clientAddress %s, userData ', clientAddress, userData) })
//     .then(function (receipt) {
//       // will be fired once the receipt its mined
//       console.log('then receipt ', receipt)
//       console.log('result ', returnValues)
//     })
// }

exports.pushClient = pushClient
