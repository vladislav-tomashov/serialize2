import { Class1Serializable } from "./Class1Serializable";
import { jsonReplacer } from "./test-utils";
import { IdGenerator } from "../common/utils";
import { SerializableSystem } from "../common/serialize";
import { setApplicationContext } from "../common/context";

export default /*async*/ function () {
  console.log("");
  console.log("========== Class1Serializable tests ==========");

  // setup
  const idGenerator1 = new IdGenerator();
  const system1 = new SerializableSystem();

  const idGenerator2 = new IdGenerator();
  const system2 = new SerializableSystem();

  try {
    // Serialization
    setApplicationContext({
      serializationContext: system1.context,
      idGenerator: idGenerator1,
    });

    const a = new Class1Serializable(1, "a");

    system1.root.push(a);

    console.log("start system1.transferChanges");
    /*await*/ system1.transferChanges(false);
    console.log("end system1.transferChanges");

    const { id: transferId, changesAsString } = system1.transferService.result;
    console.log("transfer id", transferId);
    console.log("serialized changes", changesAsString);

    // Deserialization
    setApplicationContext({
      serializationContext: system2.context,
      idGenerator: idGenerator2,
    });

    console.log("start system2.receiveChanges", system2.transferService.id);
    system2.receiveChanges(transferId, changesAsString);
    console.log("end system2.receiveChanges", system2.transferService.id);
    console.log(JSON.stringify(system2.objectsRegistry, jsonReplacer, 4));

    const cloneA = system2.objectsRegistry.getOrThrow(
      a.id
    ) as Class1Serializable;

    cloneA.func1();
    cloneA.prop3 = "test";

    console.log(
      "start system2.transferChanges id=",
      system2.transferService.id
    );
    /*await*/ system2.transferChanges(false);
    console.log("end system2.transferChanges id=", system2.transferService.id);

    const {
      id: transferId2,
      changesAsString: changesAsString2,
    } = system2.transferService.result;
    console.log("transfer id", transferId2);
    console.log("serialized changes2", changesAsString2);

    // Deserialization
    setApplicationContext({
      serializationContext: system1.context,
      idGenerator: idGenerator1,
    });

    console.log("start system1.receiveChanges", system2.transferService.id);
    system1.receiveChanges(transferId2, changesAsString2);
    console.log("end system1.receiveChanges", system2.transferService.id);
    console.log(JSON.stringify(system1.objectsRegistry, jsonReplacer, 4));
  } catch (e) {
    console.log(e);
  } finally {
    setApplicationContext(undefined);
    console.log("========== end Class1Serializable tests ==========");
    console.log("");
  }
}
