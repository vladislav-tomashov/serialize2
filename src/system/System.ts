import { SerializeService } from "../serialize/SerializeService";
import { Class1Serializable } from "../examples/Class1Serializable";

export class System {
  private _serializeService = new SerializeService();

  constructor() {
    this._serializeService.registerSerializableClass("Class1Serializable", Class1Serializable);
  }
}

/*

*/
