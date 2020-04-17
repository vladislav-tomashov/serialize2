import { Class1Serializable } from "./Class1Serializable";
import { System } from "../system/System";
import { setContext } from "../context/context";

console.log("");
console.log("========== Class1Serializable tests ==========");

const system = new System();
system.classes.addClass("Class1Serializable", Class1Serializable);
setContext(system);

const a = new Class1Serializable(1, "a");
// const serializedA = JSON.stringify(a);

// const b = new Class1Serializable(JSON.parse(serializedA));
// const serializedB = JSON.stringify(b);

// // console.log("a", a);
// // console.log("b", b);
// console.log("serializedA", serializedA);
// console.log("serializedB", serializedB);
// console.log("serializedB=serializedA", serializedB === serializedA);

// // console.log("Changes test");
// // console.log("a before changes", a);
// // console.log("a before changes JSON", JSON.stringify(a));

// a.func1();
// a.prop3 = "test";

// // console.log("a after changes", a);
// console.log("a after changes JSON", JSON.stringify(a));

// const changes = a.getChanges();
// const serializedChanges = JSON.stringify(changes);

// // console.log("a changes", changes);
// console.log("serialized a changes", serializedChanges);

// // console.log("b before changes", b);
// // console.log("b before changes JSON", JSON.stringify(b));
// b.setChanges(JSON.parse(serializedChanges));
// // console.log("b after changes", b);
// console.log("b after changes JSON", JSON.stringify(b));
// console.log("serializedB=serializedA", JSON.stringify(a) === JSON.stringify(b));
console.log("");
