import { Class1Serializable } from "./Class1Serializable";
import { System } from "../system/System";
import { setContext } from "../context/context";
import { ChangableArrayCollection } from "../serialize/serializable-collections/ChangableArrayCollection";

(async function () {
  console.log("");
  console.log("========== Class1Serializable tests ==========");

  // Serialization
  const system1 = new System();
  setContext(system1);

  system1.classes.addClass("Class1Serializable", Class1Serializable);
  system1.classes.addClass(
    "ChangableArrayCollection",
    ChangableArrayCollection
  );

  const a = new Class1Serializable(1, "a");

  system1.setRoot(a);

  await system1.transferChanges(true);

  // Deserialization
  const system2 = new System();
  setContext(system2);

  system2.classes.addClass("Class1Serializable", Class1Serializable);
  system2.classes.addClass(
    "ChangableArrayCollection",
    ChangableArrayCollection
  );

  const { id: transferId, changesAsString } = system1.transerService.result;
  console.log("serialized changes", changesAsString);

  system2.receiveChanges(transferId, changesAsString);
  console.log(JSON.stringify(system2.objects, undefined, 4));

  // Serialization
  const cloneA = system2.objects.getObjectOrThrow(a.id) as Class1Serializable;
  system2.setRoot(cloneA);
  system2.updateObjectsTable();

  cloneA.func1();
  cloneA.prop3 = "test";

  await system2.transferChanges(true);

  // Deserialization
  const {
    id: transferId2,
    changesAsString: changesAsString2,
  } = system2.transerService.result;
  console.log("serialized changes2", changesAsString2);

  system1.receiveChanges(transferId2, changesAsString2);
  console.log(JSON.stringify(system1.objects, undefined, 4));

  console.log("");
})();
