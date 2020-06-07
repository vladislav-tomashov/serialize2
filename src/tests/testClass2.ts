import { Class2Serializable } from "./Class2Serializable";
import { jsonReplacer } from "./test-utils";
import { IdGenerator } from "../common/utils";
import { SerializableSystem } from "../common/serialize";
import {
  setApplicationContext,
  resetApplicationContext,
} from "../common/context";

export default async function () {
  console.log("");
  console.log("========== Class2Serializable tests ==========");
  console.log("");

  // setup system1
  const idGenerator1 = new IdGenerator();
  const system1 = new SerializableSystem();

  // setup system2
  const idGenerator2 = new IdGenerator();
  const system2 = new SerializableSystem();

  try {
    // system1 serialization
    // set system1 as current context
    setApplicationContext({
      serializationContext: system1.context,
      idGenerator: idGenerator1,
    });

    // create serializable object
    const a = new Class2Serializable();

    // create relation between this object and system1
    system1.root.push(a);

    // transfer system1 changes
    await system1.transferChanges(true);

    // get transfer result
    const { id: transferId, changesAsString } = system1.transferService.result;
    console.log("1) transfer system1 changes");
    console.log(changesAsString);
    console.log("");

    // system2 deserialization
    // set system2 as current context
    setApplicationContext({
      serializationContext: system2.context,
      idGenerator: idGenerator2,
    });

    // receive changes from system1
    system2.receiveChanges(transferId, changesAsString);
    console.log("2) system2 state after receiving changes");
    console.log(JSON.stringify(system2.objectsRegistry, jsonReplacer, 4));
    console.log("");

    // get some object from system2
    const cloneA = system2.objectsRegistry.getOrThrow(
      a.id
    ) as Class2Serializable;

    // modify this object
    cloneA.prop1.func1();
    cloneA.prop1.prop3 = "test";

    // transfer system2 changes
    await system2.transferChanges(true);

    // get transfer result
    const {
      id: transferId2,
      changesAsString: changesAsString2,
    } = system2.transferService.result;
    console.log("3) transfer system2 changes");
    console.log(changesAsString2);
    console.log("");

    // system1 deserialization
    // set system1 as current context
    setApplicationContext({
      serializationContext: system1.context,
      idGenerator: idGenerator1,
    });

    // receive changes from system2
    system1.receiveChanges(transferId2, changesAsString2);
    console.log("4) system1 state after receiving changes");
    console.log(JSON.stringify(system1.objectsRegistry, jsonReplacer, 4));
  } catch (e) {
    console.log(e);
  } finally {
    // reset current context
    resetApplicationContext();
    console.log("========== end Class2Serializable tests ==========");
    console.log("");
  }
}
