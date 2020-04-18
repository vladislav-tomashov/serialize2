import { Class1Serializable } from "./Class1Serializable";
import { System } from "../system/System";
import { setContext } from "../context/context";
import { ChangableArrayCollection } from "../serialize/serializable-collections/ChangableArrayCollection";

console.log("");
console.log("========== Class1Serializable tests ==========");

const system1 = new System();
setContext(system1);

system1.classes.addClass("Class1Serializable", Class1Serializable);
system1.classes.addClass("ChangableArrayCollection", ChangableArrayCollection);

const a = new Class1Serializable(1, "a");
a.func1();
a.prop3 = "test";

const changes = system1.changes.getChanges();
const serializedChanges = JSON.stringify(changes, undefined, 4);

console.log("serialized changes", serializedChanges);

// // console.log("b before changes", b);
// // console.log("b before changes JSON", JSON.stringify(b));
// b.setChanges(JSON.parse(serializedChanges));
// // console.log("b after changes", b);
// console.log("b after changes JSON", JSON.stringify(b));
// console.log("serializedB=serializedA", JSON.stringify(a) === JSON.stringify(b));
console.log("");
