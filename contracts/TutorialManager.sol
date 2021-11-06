pragma solidity 0.8.0;

import "./Tutorial.sol";
import "./Ownable.sol";

//Smart Contract responsible for creating, paying, and setting tutorial to finished.
contract TutorialManager is Ownable {
    
    enum TutorialState{NotPaid, Paid, Finished}
    
    struct Tutorial_Item {
        Tutorial _tutorial;
        uint _tutorialId;
        uint _tutorialPrice;
        TutorialManager.TutorialState _tutorialState;
    }
    
    mapping(uint => Tutorial_Item) public tutorials;
    
    uint numberOfTutorials;
    
    event TutorialStateChanges(uint indexed _tutorialId, uint indexed _index, TutorialManager.TutorialState indexed _tutorialState);
    
    function createTutorial(uint _tutorialPrice, uint _tutorialId) public onlyOwner {
        Tutorial tutorial = new Tutorial(this, numberOfTutorials, _tutorialPrice);
        tutorials[numberOfTutorials]._tutorial = tutorial;
        tutorials[numberOfTutorials]._tutorialPrice = _tutorialPrice;
        tutorials[numberOfTutorials]._tutorialId = _tutorialId;
        tutorials[numberOfTutorials]._tutorialState = TutorialState.NotPaid;
        
        emit TutorialStateChanges(tutorials[numberOfTutorials]._tutorialId, numberOfTutorials, TutorialState.NotPaid);
        
        numberOfTutorials++;
    }
    
    function payForTutorial(uint _index) public payable {
        require(tutorials[_index]._tutorialState == TutorialState.NotPaid, "Tutorial is paid already.");
        require(tutorials[_index]._tutorialPrice == msg.value, "Must pay the tutorial for the full amount.");
        tutorials[_index]._tutorialState = TutorialState.Paid;
        
        emit TutorialStateChanges(tutorials[_index]._tutorialId, _index, TutorialState.Paid);
    }
    
    function finishTutorial(uint _index) public onlyOwner {
        require(tutorials[_index]._tutorialState == TutorialState.Paid, "Tutorial is not finished to be considered finished.");
        tutorials[_index]._tutorialState = TutorialState.Finished;
        
        emit TutorialStateChanges(tutorials[_index]._tutorialId, _index, TutorialState.Finished);
    }
    
}