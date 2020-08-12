/* eslint-disable no-else-return */
import { format } from 'date-fns';
import { Op } from 'sequelize';

import Invoice from '../models/Invoice';
import Client from '../models/Client';

class InvoiceController {
  async show(req, res) {
    const { client_id } = req.params;

    const { login, observacao } = await Client.findByPk(client_id);

    const pendingInvoices = await Invoice.findAll({
      where: {
        login,
        status: {
          [Op.or]: ['vencido', 'aberto'],
        },
      },
    });

    pendingInvoices.sort((a, b) => {
      const key1 = new Date(a.datavenc).getTime();
      const key2 = new Date(b.datavenc).getTime();

      if (key1 < key2) {
        return -1;
      } else if (key1 === key2) {
        return 0;
      } else {
        return 1;
      }
    });

    const pending_invoices = [];
    pendingInvoices.forEach(invoice => {
      pending_invoices.push({
        title: format(invoice.datavenc, 'dd/MM/yyyy'),
        content: {
          tipo: invoice.tipo,
          valor: invoice.valor,
          status: invoice.status,
          descricao: invoice.obs,
        },
      });
    });

    const paidInvoices = await Invoice.findAll({
      where: {
        login,
        status: 'pago',
      },
    });

    paidInvoices.sort((a, b) => {
      const keyA = a.datavenc;
      const keyB = b.datavenc;

      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });

    paidInvoices.sort(
      (a, b) => new Date(b.datavenc).getTime() - new Date(a.datavenc).getTime()
    );

    const paid_invoices = [];
    paidInvoices.forEach(invoice => {
      paid_invoices.push({
        title: format(invoice.datavenc, 'dd/MM/yyyy'),
        content: {
          tipo: invoice.tipo,
          valor: invoice.valor,
          status: invoice.status,
          descricao: invoice.obs,
        },
      });
    });

    const response = {
      pending_invoices,
      paid_invoices,
    };

    return res.json({
      observacao,
      invoices: response,
    });
  }
}

export default new InvoiceController();
