import {DefaultState, TestPlatformType} from "@/models/testplatform/types";
import reducers from "@/models/testplatform/reducers";
import effects from "@/models/testplatform/effects";

const TestPlatformModel: TestPlatformType = {
  namespace: 'testPlatform',
  state: DefaultState,
  effects: effects,
  reducers: reducers,
}

export default TestPlatformModel
