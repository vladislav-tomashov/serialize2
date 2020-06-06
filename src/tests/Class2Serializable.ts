// import { IClass2 } from "./IClass2";
// import { Class1Serializable } from "./Class1Serializable";
// import { ChangableArrayCollection } from "../serialize/serializable-collections/ChangableArrayCollection";
// import { BaseSerializable } from "../serialize/serializable-object/BaseSerializable";
// import { registerSerializableClass } from "../serialize/services/ClassesRegistry";

// class Class2Serializable extends BaseSerializable<any, any> implements IClass2 {
//   constructor() {
//     super();

//     this.prop1 = new Class1Serializable(5, "abc");
//     this.prop2 = new ChangableArrayCollection([
//       new Class1Serializable(1, "test1"),
//       new Class1Serializable(2, "test2"),
//     ]);
//   }

//   // Proxied state properties
//   public get prop1() {
//     return this.getProperty("prop1") as Class1Serializable;
//   }

//   public set prop1(value: Class1Serializable) {
//     this._setProperty("prop1", value);
//   }

//   public get prop2() {
//     return this.getProperty("prop2") as ChangableArrayCollection<
//       Class1Serializable
//     >;
//   }

//   public set prop2(value: ChangableArrayCollection<Class1Serializable>) {
//     this._setProperty("prop2", value);
//   }
// }

// registerSerializableClass(Class2Serializable);

// export { Class2Serializable };
