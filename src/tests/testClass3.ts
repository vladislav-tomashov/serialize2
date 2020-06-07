// import { Class2Serializable } from "./Class2Serializable";
// import { Class3Serializable } from "./Class3Serializable";
// import { System } from "../system/System";
// import { setContext } from "../context/context";
// import { jsonReplacer } from "./test-utils";

// export default async function () {
//   try {
//     console.log("");
//     console.log("========== Class3Serializable tests ==========");

//     // Serialization
//     const system1 = new System();
//     setContext(system1);

//     const a = new Class3Serializable();

//     system1.root.push(a);

//     await system1.transferChanges(true);

//     // Deserialization
//     const system2 = new System();

//     const { id: transferId, changesAsString } = system1.transferService.result;
//     console.log("");
//     console.log("serialized changes", changesAsString);

//     system2.receiveChanges(transferId, changesAsString);
//     // console.log(JSON.stringify(system2.objectsRegistry, jsonReplacer, 4));

//     // Serialization
//     const cloneA = system2.objectsRegistry.getOrThrow(
//       a.id
//     ) as Class3Serializable;

//     cloneA.prop1.func1();
//     cloneA.prop1.prop3 = "test";
//     cloneA.prop31.prop1.prop3 = "Super Puper!!!";
//     cloneA.prop31.prop1.func1();
//     (cloneA.prop32.get(1) as Class2Serializable).prop1.prop3 = "WWWWWWWWWWWWW";

//     await system2.transferChanges(false);

//     // Deserialization
//     const {
//       id: transferId2,
//       changesAsString: changesAsString2,
//     } = system2.transferService.result;
//     console.log("");
//     console.log("serialized changes2", changesAsString2);

//     system1.receiveChanges(transferId2, changesAsString2);
//     // console.log(JSON.stringify(system1.objectsRegistry, jsonReplacer, 4));
//   } finally {
//     setContext(undefined);
//     console.log("");
//     console.log("========== end Class3Serializable tests ==========");
//     console.log("");
//   }
// }
