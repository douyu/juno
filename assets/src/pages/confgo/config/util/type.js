export function checkType(val, type) {
  let originValue = null;
  try {
    originValue = JSON.parse(val);
  } catch (e) {
    return new Error(`类型错误:无法解析，请填写${type}类型的值`);
  }
  let valType = typeof originValue;
  if (Array.isArray(originValue)) {
    valType = "array";
  }
  const typeMap = {
    string: ["string"],
    number: ["int", "float", "int64", "float64", "int32", "float32"],
    boolean: ["bool"],
    array: ["slice"]
  };
  const tomlType = typeMap[valType];
  if (tomlType.some(v => v === type)) {
    //pass
    return true;
  } else {
    //error
    return new Error(`类型错误:选择类型为${type}，实际填写类型为${valType}`);
  }
}

export function getOpSapn(key, text) {
  const map = {
    new: (
      <span
        style={{
          backgroundColor: "#52c41a",
          marginLeft: "8px",
          color: "#fff",
          borderRadius: "5px",
          padding: "4px"
        }}
      >
        {text || "新"}
      </span>
    ),
    update: (
      <span
        style={{
          backgroundColor: "#6495ED",
          marginLeft: "8px",
          color: "#fff",
          borderRadius: "5px",
          padding: "4px"
        }}
      >
        {text || "更"}
      </span>
    ),
    del: (
      <span
        style={{
          backgroundColor: "#F31D28",
          marginLeft: "8px",
          color: "#fff",
          borderRadius: "5px",
          padding: "4px"
        }}
      >
        {text || "删"}
      </span>
    )
  };
  return map[key];
}
