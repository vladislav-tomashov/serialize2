import { Class1Serializable } from "./Class1Serializable";
import { System } from "../system/System";
import { setContext } from "../context/context";
import { jsonReplacer } from "./test-utils";

export default async function () {
  console.log("");
  console.log("========== Class1Serializable tests ==========");

  try {
    // Serialization
    const system1 = new System();
    setContext(system1);

    const a = new Class1Serializable(1, "a");

    system1.root.push(a);

    await system1.transferChanges(false);

    // Deserialization
    const system2 = new System();

    const { id: transferId, changesAsString } = system1.transerService.result;
    console.log("serialized changes", changesAsString);

    system2.receiveChanges(transferId, changesAsString);
    // console.log(JSON.stringify(system2.objectsRegistry, jsonReplacer, 4));

    // Serialization
    const cloneA = system2.objectsRegistry.getOrThrow(
      a.id
    ) as Class1Serializable;

    cloneA.func1();
    cloneA.prop3 = "test";

    await system2.transferChanges(false);

    // Deserialization
    const {
      id: transferId2,
      changesAsString: changesAsString2,
    } = system2.transerService.result;
    console.log("serialized changes2", changesAsString2);

    system1.receiveChanges(transferId2, changesAsString2);
    // console.log(JSON.stringify(system1.objectsRegistry, jsonReplacer, 4));
  } finally {
    setContext(undefined);
    console.log("========== end Class1Serializable tests ==========");
    console.log("");
  }
}
