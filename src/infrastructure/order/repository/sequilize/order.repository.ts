import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import ProductModel from "../../../product/repository/sequelize/product.model";

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        where: {
          id: entity.id,
        },
      },
    );
  }

  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: {
          id,
        },
        include: [{
          model: OrderItemModel,
          include: [ProductModel]
        }],
      });
    } catch (error) {
      throw new Error("Order not found");
    }

    const orderItem = orderModel.items.map((orderItensModel: any) =>
      new OrderItem(orderItensModel.id, orderItensModel.name, orderItensModel.product.price, orderItensModel.product_id, orderItensModel.quantity)
    );

    return new Order(id, orderModel.customer_id, orderItem);
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [{
        model: OrderItemModel,
        include: [ProductModel]
      }]
    });

    return orderModels.map((orderModel) => {
      const orderItemsModels = orderModel.items.map((orderItensModel) =>
        new OrderItem(orderItensModel.id, orderItensModel.name, orderItensModel.product.price, orderItensModel.product_id, orderItensModel.quantity)
      );
      return new Order(orderModel.id, orderModel.customer_id, orderItemsModels);
    });
  }

}
