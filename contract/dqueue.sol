pragma solidity ^0.4.16;
// We have to specify what version of compiler this code will compile with
contract QueueManager {
    
    
    struct QueueInfo {
        bytes32 mDesc;
        bytes32 mTitle;
        address mOwnerAddress;
        address mQueueAddress;
    }
    mapping(address => QueueInfo) public mapQueues;
    address[] queues;
    //todo: Protect this function call only to contract creator or 
    //who pays for the service 
    function createQueue (bytes32 title, bytes32 desc, bool freeToEnter, bytes32 data) returns (address)  {
        address newQueueAddress = new Queue(title, desc, freeToEnter, data, msg.sender);
        
        queues.push(newQueueAddress);
        mapQueues[newQueueAddress] = QueueInfo({
            mDesc: desc,
            mTitle: title,
            mOwnerAddress: msg.sender,
            mQueueAddress: newQueueAddress
        });
        
        return newQueueAddress;
    }
    
    function getQueuesAddresses() constant returns (address[]){
        return queues;
    }
    function kill(address queueAddress) {
        if(mapQueues[queueAddress].mQueueAddress == queueAddress){
            //should kill contract
            delete mapQueues[queueAddress];
            queueAddress.call(bytes4(sha3("kill()"))); //todo: maybe remove
        }
    }
}
contract Queue {
    
    
    event ClientAdded(
        address cliendAddress,
        bytes32 data
    );
    event ClientRemoved(
        address clientAddress,
        uint timestamp,
        bytes32 data
    );
    event QueueKilled(address queueAddress);
    
    struct Client {
        address id;
        uint timestamp;
        bytes32 data;
    }
    
    bytes32 title;
    bytes32 description;
    address creator;
    bool freeEntrance;
    uint startIndex;
    uint count;
    uint timestamp;
    bytes32 data;
    
    mapping(uint => Client) clients;
    
    // Add client to queue
    function pushClient(address clientAddress, bytes32 userData){
        if(freeEntrance || msg.sender == creator){
            clients[startIndex + count] = Client({
                id: clientAddress, 
                timestamp: now, 
                data: userData
            });
    
            count++;
            
            ClientAdded(clientAddress, userData);
        }
    }
    function popClient() returns (address, uint, bytes32){
        if(msg.sender == creator){
            if(count > 0){
                address removedAddress = clients[startIndex].id;
                uint removedTimestamp = clients[startIndex].timestamp;
                bytes32 removedData = clients[startIndex].data;
                delete clients[startIndex]; //brisanje sa pocetka
                startIndex++;
                count--;
                
                if(count == 0){
                    startIndex = 0;
                }
                
                ClientRemoved(removedAddress, removedTimestamp, removedData);
                return (removedAddress, removedTimestamp, removedData);
            }
        }
    }
    function getNumberOfClients() constant returns (uint){
        return count;
    }
    
    function getClientAtIndex(uint index) constant returns (address, uint, bytes32) {
        require(index >= 0 && index < count);
        
        uint offset = startIndex + index; 
        return (clients[offset].id, clients[offset].timestamp, clients[offset].data);
    }
    
    function Queue (bytes32 tit, bytes32 desc, bool isFreeToEnter, bytes32 dat, address creatorAddress) {
        title = tit;
        description = desc;
        creator = creatorAddress;
        freeEntrance = isFreeToEnter;
        startIndex = 0;
        data = dat;
        timestamp = now;
        count = 0;
    }
    function kill() {
        if (msg.sender == creator){
            QueueKilled(address(this));
            suicide(creator);    
        }
    }
}