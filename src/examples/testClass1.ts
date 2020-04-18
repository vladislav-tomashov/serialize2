import { Class1Serializable } from "./Class1Serializable";
import { System } from "../system/System";
import { setContext } from "../context/context";
import { ChangableArrayCollection } from "../serialize/serializable-collections/ChangableArrayCollection";
import { treeToArray } from "../serialize/utils/tree-utils";
import { IGetProperty } from "../serialize/serialize.interface";

console.log("");
console.log("========== Class1Serializable tests ==========");

const system1 = new System();
setContext(system1);

system1.classes.addClass("Class1Serializable", Class1Serializable);
system1.classes.addClass("ChangableArrayCollection", ChangableArrayCollection);

const a = new Class1Serializable(1, "a");

let changes = system1.changes.getChanges();
let serializedChanges = JSON.stringify(changes, undefined, 4);

console.log("serialized changes", serializedChanges);

system1.changes.clear();
system1.objects.clear();

const getNodes = (node: IGetProperty<any, any>) => {
  return Object.values(node.getAllProperties()).filter(
    (x) => typeof x === "object"
  );
};

const objects = treeToArray(a, getNodes);
system1.objects.addCollection(objects);

a.func1();
a.prop3 = "test";

changes = system1.changes.getChanges();
serializedChanges = JSON.stringify(changes, undefined, 4);

console.log("serialized changes", serializedChanges);

console.log("");
