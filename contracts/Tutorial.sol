pragma solidity 0.8.0;
import "./TutorialManager.sol";

//Tutorial smart contract will handling the payment of each tutorial
contract Tutorial {
   uint public index;
   uint public price;
   uint public amountPaid;
   
   TutorialManager public tutorialManager;
   
   constructor(TutorialManager _tutorialManager, uint _index, uint _price) public {
       index = _index;
       price = _price;
       tutorialManager = _tutorialManager;
   }
   
   receive() external payable {
       require(amountPaid == 0, "Must pay full amount.");
       amountPaid += msg.value;
       (bool success, ) = address(tutorialManager).call{value: msg.value}(abi.encodeWithSignature("payForTutorial(uint256)", index));
       require(success, "Purchase was not successful!");
   }
   
}
