const TutorialManager = artifacts.require("./TutorialManager.sol");

contract("Tutorial Manager", (accounts) => {
  it("Create tutorial successfully.", async () => {
    // console.log("Tutorial Manager:", TutorialManager)
    const tutorialManagerInstance = await TutorialManager.deployed();
    const tutorialId = 20;
    const tutorialPrice = 200;
    const result = await tutorialManagerInstance.createTutorial(
      tutorialPrice,
      tutorialId,
      { from: accounts[0] }
    );
    assert.equal(result.logs[0].args._index, 0, "Tutorial not created");
    assert.equal(
      result.logs[0].args._tutorialId,
      20,
      "Tutorial Id not recorded"
    );
    assert.equal(result.logs[0].args._index, 0, "Invalid State");
  });
});
