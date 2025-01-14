export const createOrderCode = () => `DH-${new Date().getTime().toString().slice(-6)}`
export const createCouponCode = () => `CP-${new Date().getTime().toString().slice(-6)}`