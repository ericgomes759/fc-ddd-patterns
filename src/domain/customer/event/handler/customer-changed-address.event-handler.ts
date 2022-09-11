import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangeAddressEvent from "../customer-changed-address.event";

export default class SendConsoleLogHandler implements EventHandlerInterface<CustomerChangeAddressEvent> {
  handle(event: CustomerChangeAddressEvent): void {
    console.log(`Endereço do cliente: {id}, {nome} alterado para: {endereco}`,
      event.eventData.id,
      event.eventData.name,
      event.eventData.address
    );
  }
}