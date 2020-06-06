import { Class1Serializable } from "./Class1Serializable";
import { jsonReplacer } from "./test-utils";
import { IdGenerator } from "../common/utils";
import { SerializableSystem } from "../common/serialize";
import { setApplicationContext } from "../common/context";

export default async function () {
  console.log("");
  console.log("========== Class1Serializable tests ==========");

  try {
    // Serialization
    const idGenerator1 = new IdGenerator();
    const system1 = new SerializableSystem();

    setApplicationContext({
      settingsManager: null,
      serializationContext: system1.context,
      idGenerator: idGenerator1,
    });

    const a = new Class1Serializable(1, "a");

    system1.root.push(a);

    await system1.transferChanges(false);

    // Deserialization
    const system2 = new SerializableSystem();

    const { id: transferId, changesAsString } = system1.transferService.result;
    console.log("serialized changes", changesAsString);

    system2.receiveChanges(transferId, changesAsString);
    console.log(JSON.stringify(system2.objectsRegistry, jsonReplacer, 4));

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
    } = system2.transferService.result;
    console.log("serialized changes2", changesAsString2);

    system1.receiveChanges(transferId2, changesAsString2);
    // console.log(JSON.stringify(system1.objectsRegistry, jsonReplacer, 4));
  } finally {
    setApplicationContext(undefined);
    console.log("========== end Class1Serializable tests ==========");
    console.log("");
  }
}
