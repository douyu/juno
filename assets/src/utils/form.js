/**
 * 为了方便过滤空值的情况，如果不这么写依然会传字段，导致form getFieldDecorator 不能设置为空
 * @param field
 * @returns {*}
 */
export const initialValue  = (field)=>{
    return field ? {initialValue:field} : {}
}
