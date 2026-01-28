require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());
const path = require("path");

// ...





const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
});

const JWT_SECRET = process.env.JWT_SECRET;

// HEALTH
app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT 1");
    res.json({ ok: true, db: result.rows[0] });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// LOGIN
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username e password são obrigatórios" });
  }

  try {
    const result = await pool.query(
      "SELECT id, username, password_hash, role, email FROM users WHERE username = $1",
      [username.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Usuário ou senha incorretos" });
    }

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Usuário ou senha incorretos" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    console.error("Erro no login:", e);
    res.status(500).json({ message: "Erro no servidor", error: e.message });
  }
});

// CRIAR USER
app.post("/users", async (req, res) => {
  try {
    const { email, role, password } = req.body;

    if (!email || !role || !password) {
      return res
        .status(400)
        .json({ message: "Email, role e password são obrigatórios" });
    }

    const username = email.toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);

    const insertResult = await pool.query(
      `INSERT INTO users (username, email, role, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, role, created_at`,
      [username, email, role.toLowerCase(), passwordHash]
    );

    res.status(201).json(insertResult.rows[0]);
  } catch (err) {
    console.error("Erro ao criar utilizador:", err);
    res.status(500).json({ error: "Erro ao criar utilizador" });
  }
});

// LISTAR USERS
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, role, created_at FROM users ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar utilizadores:", err);
    res.status(500).json({ error: "Erro ao listar utilizadores" });
  }
});

// REMOVER USER
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Utilizador não encontrado" });
    }

    return res.status(204).send();
  } catch (err) {
    console.error("Erro ao remover utilizador:", err);
    res.status(500).json({ error: "Erro ao remover utilizador" });
  }
});

// LISTAR CLIENTES
app.get("/clients", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         id,
         nome,
         email,
         codigo_pais,
         telefone,
         telefone2,
         nuit,
         localizacao,
         endereco,
         cidade,
         provincia,
         caixa_postal,
         saldo,
         status,
         criado_em
       FROM clients
       ORDER BY id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar clientes:", err);
    res.status(500).json({ error: "Erro ao listar clientes" });
  }
});

// CRIAR CLIENTE
app.post("/clients", async (req, res) => {
  try {
    const {
      nome,
      email,
      codigoPais,
      telefone,
      telefone2,
      nuit,
      localizacao,
      endereco,
      cidade,
      provincia,
      caixaPostal,
      saldoInicial,
      criadoEm,
    } = req.body;

    if (!nome || !email || !telefone || saldoInicial == null) {
      return res
        .status(400)
        .json({ message: "Nome, email, telefone e saldoInicial são obrigatórios" });
    }

    const insert = await pool.query(
      `INSERT INTO clients 
       (nome, email, codigo_pais, telefone, telefone2, nuit, localizacao, endereco, cidade, provincia, caixa_postal, saldo_inicial, saldo, status, criado_em)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'Ativo',$14)
       RETURNING id, nome, email, telefone, nuit, cidade, provincia,
                 caixa_postal AS "caixaPostal",
                 saldo,
                 status,
                 criado_em AS "criadoEm"`,
      [
        nome,
        email,
        codigoPais || "+258",
        telefone,
        telefone2 || null,
        nuit || null,
        localizacao || null,
        endereco || null,
        cidade || null,
        provincia || null,
        caixaPostal || null,
        saldoInicial,
        saldoInicial,
        criadoEm || new Date().toISOString().slice(0, 10),
      ]
    );

    res.status(201).json(insert.rows[0]);
  } catch (err) {
    console.error("Erro ao criar cliente:", err);
    res.status(500).json({ error: "Erro ao criar cliente" });
  }
});

// ATUALIZAR CLIENTE
app.put("/clients/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nome,
    email,
    telefone,
    endereco,
    cidade,
    provincia,
    caixaPostal,
    nuit,
    status,
  } = req.body;

  try {
    const update = await pool.query(
      `UPDATE clients
       SET nome = $1,
           email = $2,
           telefone = $3,
           endereco = $4,
           cidade = $5,
           provincia = $6,
           caixa_postal = $7,
           nuit = $8,
           status = $9
       WHERE id = $10
       RETURNING id, nome, email, telefone, nuit, cidade, provincia,
                 caixa_postal AS "caixaPostal",
                 saldo,
                 status,
                 criado_em AS "criadoEm"`,
      [
        nome,
        email,
        telefone,
        endereco || null,
        cidade || null,
        provincia || null,
        caixaPostal || null,
        nuit || null,
        status || "Ativo",
        id,
      ]
    );

    if (update.rowCount === 0) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    res.json(update.rows[0]);
  } catch (err) {
    console.error("Erro ao atualizar cliente:", err);
    res.status(500).json({ error: "Erro ao atualizar cliente" });
  }
});

// LISTAR FORNECEDORES
app.get("/fornecedores", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         nome,
         empresa,
         email,
         telefone,
         nuit,
         cidade,
         provincia,
         saldo,
         status,
         criado_em AS "criadoEm"
       FROM fornecedores
       ORDER BY id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar fornecedores:", err);
    res.status(500).json({ error: "Erro ao listar fornecedores" });
  }
});

// CRIAR FORNECEDOR
app.post("/fornecedores", async (req, res) => {
  try {
    const {
      nome,
      email,
      telefone,
      nuit,
      empresa,
      cidade,
      provincia,
      saldoInicial,
      criadoEm,
    } = req.body;

    if (!nome || !email || !telefone || saldoInicial == null) {
      return res
        .status(400)
        .json({ message: "Nome, email, telefone e saldoInicial são obrigatórios" });
    }

    const insert = await pool.query(
      `INSERT INTO fornecedores
       (nome, empresa, email, telefone, nuit, cidade, provincia, saldo_inicial, saldo, status, criado_em)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'Ativo',$10)
       RETURNING id, nome, empresa, email, telefone, nuit, cidade, provincia,
                 saldo, status, criado_em AS "criadoEm"`,
      [
        nome,
        empresa || null,
        email,
        telefone,
        nuit || null,
        cidade || null,
        provincia || null,
        saldoInicial,
        saldoInicial,
        criadoEm || new Date().toISOString().slice(0, 10),
      ]
    );

    res.status(201).json(insert.rows[0]);
  } catch (err) {
    console.error("Erro ao criar fornecedor:", err);
    res.status(500).json({ error: "Erro ao criar fornecedor" });
  }
});

//
// ------------- VENDAS / FATURAS -------------
//

// PRÓXIMA REFERÊNCIA DE VENDA
app.get("/vendas/proxima-referencia", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT last_value FROM vendas_ref_seq"
    );

    const last = rows[0]?.last_value || 0;
    const next = Number(last) + 1;
    const referencia = `FT-${String(next).padStart(5, "0")}`;

    res.json({ referencia });
  } catch (err) {
    console.error("Erro ao gerar próxima referência de venda:", err);
    res.status(500).json({ message: "Erro ao gerar próxima referência" });
  }
});

// CRIAR VENDA / FATURA
// CRIAR VENDA / FATURA (com lucro_total e margem_total)
app.post("/vendas", async (req, res) => {
  const {
    clienteId,
    moeda,
    localizacao,
    prazoVencimento,
    data,
    dataFim,
    observacoes,
    numeroRequisicao,
    itens,
    subTotal,
    descontoTotal,
    impostoTotal,
    totalDocumento,
  } = req.body;

  // 1) validação básica de entrada
  if (!clienteId || !data || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({
      message: "clienteId, data e pelo menos um item são obrigatórios",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 2) gerar referência
    const seqResult = await client.query(
      "SELECT nextval('vendas_ref_seq') AS numero"
    );
    const numero = seqResult.rows[0].numero;
    const referencia = `FT-${String(numero).padStart(5, "0")}`;

    // 3) calcular lucro_total a partir dos produtos
    let lucroTotal = 0;

    for (const item of itens) {
      if (!item.produtoId) {
        throw new Error("produtoId ausente em um dos itens");
      }

      const prodRes = await client.query(
        "SELECT preco_compra FROM produtos WHERE id = $1",
        [item.produtoId]
      );
      const prod = prodRes.rows[0];

      if (!prod) {
        throw new Error(`Produto não encontrado para id=${item.produtoId}`);
      }

      const custoUnit = prod.preco_compra ? Number(prod.preco_compra) : 0;
      const precoVendaUnit = Number(item.precoUnit) || 0;
      const qtd = Number(item.quantidade) || 0;

      const lucroItem = (precoVendaUnit - custoUnit) * qtd;
      lucroTotal += lucroItem;
    }

    const totalDocNum = Number(totalDocumento) || 0;
    const margemTotal =
      totalDocNum > 0 ? (lucroTotal / totalDocNum) * 100 : 0;

    // 4) inserir venda com lucro_total e margem_total
    const insertVenda = await client.query(
      `INSERT INTO vendas (
        referencia,
        client_id,
        moeda,
        localizacao,
        prazo_vencimento,
        data,
        data_fim,
        observacoes,
        numero_requisicao,
        sub_total,
        desconto_total,
        imposto_total,
        total_documento,
        lucro_total,
        margem_total,
        status,
        criado_em
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'Pendente', CURRENT_DATE)
      RETURNING
        id,
        referencia,
        client_id,
        moeda,
        localizacao,
        prazo_vencimento AS "prazoVencimento",
        data,
        data_fim AS "dataFim",
        observacoes,
        numero_requisicao AS "numeroRequisicao",
        sub_total AS "subTotal",
        desconto_total AS "descontoTotal",
        imposto_total AS "impostoTotal",
        total_documento AS "totalDocumento",
        lucro_total AS "lucroTotal",
        margem_total AS "margemTotal",
        status,
        criado_em AS "criadoEm"`,
      [
        referencia,
        clienteId,
        moeda || "MZN",
        localizacao || "Armazem",
        prazoVencimento || "Pagamento na Entrega",
        data,
        dataFim || null,
        observacoes || null,
        numeroRequisicao || null,
        subTotal || 0,
        descontoTotal || 0,
        impostoTotal || 0,
        totalDocNum,
        lucroTotal,
        margemTotal,
      ]
    );

    const venda = insertVenda.rows[0];

    // 5) inserir itens
    const insertItemQuery = `
      INSERT INTO itens_venda (
        venda_id,
        produto_id,
        descricao,
        quantidade,
        preco_unit,
        iva_percent,
        desconto_percent
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING id, descricao, quantidade, preco_unit AS "precoUnit",
                iva_percent AS "ivaPercent",
                desconto_percent AS "descontoPercent"
    `;

    const itensInseridos = [];

    for (const item of itens) {
      const result = await client.query(insertItemQuery, [
        venda.id,
        item.produtoId,
        item.descricao,
        item.quantidade,
        item.precoUnit,
        item.ivaPercent || 0,
        item.descontoPercent || 0,
      ]);
      itensInseridos.push(result.rows[0]);
    }

    await client.query("COMMIT");

    return res.status(201).json({
      ...venda,
      itens: itensInseridos,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro ao criar venda:", err.message);
    return res
      .status(500)
      .json({ message: "Erro ao criar venda", error: err.message });
  } finally {
    client.release();
  }
});

// LISTAR FATURAS
app.get("/facturas", async (req, res) => {
  const { clientId } = req.query;

  try {
    const params = [];
    let where = "";

    if (clientId) {
      where = "WHERE v.client_id = $1";
      params.push(clientId);
    }

    const result = await pool.query(
      `SELECT
         v.id,
         v.referencia,
         v.client_id,
         c.nome AS cliente,
         v.data,
         v.prazo_vencimento AS "prazoVencimento",
         v.total_documento AS valor,
         v.status,
         v.moeda,
         v.criado_em AS "criadoEm"
       FROM vendas v
       JOIN clients c ON c.id = v.client_id
       ${where}
       ORDER BY v.id DESC`,
      params
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar faturas:", err);
    res.status(500).json({ message: "Erro ao listar faturas" });
  }
});

//
// ------------- RECIBOS -------------
//

// PRÓXIMA REFERÊNCIA DE RECIBO
app.get("/recibos/proxima-referencia", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT last_value FROM recibos_ref_seq"
    );

    const last = rows[0]?.last_value || 0;
    const next = Number(last) + 1;
    const referencia = `RE-${String(next).padStart(5, "0")}`;

    res.json({ referencia });
  } catch (err) {
    console.error("Erro ao gerar próxima referência de recibo:", err);
    res.status(500).json({ message: "Erro ao gerar próxima referência", error: err.message });
  }
});

// CRIAR RECIBO
app.post("/recibos", async (req, res) => {
  const {
    clienteId,
    data,
    contaId,
    metodoPagamento,
    valor,
    moeda,
    status,
  } = req.body;

  if (!clienteId || !data || valor == null) {
    return res.status(400).json({
      message: "clienteId, data e valor são obrigatórios",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const seqResult = await client.query(
      "SELECT nextval('recibos_ref_seq') AS numero"
    );
    const numeroSeq = seqResult.rows[0].numero;
    const numero = `RE-${String(numeroSeq).padStart(5, "0")}`;

    const insert = await client.query(
      `INSERT INTO recibos (
         numero,
         client_id,
         data,
         valor,
         moeda,
         status,
         metodo_pagamento,
         conta_id,
         created_at,
         updated_at
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW())
       RETURNING
         id,
         numero,
         client_id,
         data,
         valor,
         moeda,
         status`,
      [
        numero,
        clienteId,
        data,
        valor,
        moeda || "MZN",
        status || "Pago",
        metodoPagamento || null,
        contaId || null,
      ]
    );

    const recibo = insert.rows[0];

    const clienteRes = await client.query(
      "SELECT nome FROM clients WHERE id = $1",
      [recibo.client_id]
    );
    const clienteNome = clienteRes.rows[0]?.nome || "";

    await client.query("COMMIT");

    res.status(201).json({
      id: recibo.id,
      numero: recibo.numero,
      cliente: clienteNome,
      data: recibo.data,
      valor: recibo.valor,
      moeda: recibo.moeda,
      status: recibo.status,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro ao criar recibo:", err);
    res
      .status(500)
      .json({ message: "Erro ao criar recibo", error: err.message });
  } finally {
    client.release();
  }
});

// LISTAR RECIBOS
app.get("/recibos", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         r.id,
         r.numero,
         c.nome AS cliente,
         r.data,
         r.valor,
         r.moeda,
         r.status
       FROM recibos r
       JOIN clients c ON c.id = r.client_id
       ORDER BY r.id DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar recibos:", err);
    res.status(500).json({ message: "Erro ao listar recibos", error: err.message });
  }
});





// LISTAR CONTRATOS
app.use(
  "/uploads/contratos",
  express.static(path.join(__dirname, "uploads/contratos"))
);

// depois disso vêm as rotas: app.get("/contratos"...), etc.

app.get("/contratos", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         ct.id,
         ct.numero,
         c.nome AS cliente,
         ct.tipo,
         ct.data_inicio AS "inicio",
         ct.data_fim    AS "fim",
         ct.estado,
         ct.ficheiro    AS "ficheiroNome"
       FROM contratos ct
       JOIN clients c ON c.id = ct.client_id
       ORDER BY ct.id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar contratos:", err);
    res
      .status(500)
      .json({ message: "Erro ao listar contratos", error: err.message });
  }
});

// CRIAR CONTRATO (gera número, usa client_id)

app.post("/contratos", async (req, res) => {
  const { clientId, inicio, fim, estado } = req.body;

  if (!clientId || !inicio) {
    return res.status(400).json({
      message: "clientId e inicio são obrigatórios",
    });
  }

  const clientIdNum = Number(clientId);
  if (Number.isNaN(clientIdNum)) {
    return res.status(400).json({ message: "clientId inválido" });
  }

  try {
    // 1) Buscar nome do cliente para preencher a coluna "cliente"
    const clienteRes = await pool.query(
      `SELECT nome FROM clients WHERE id = $1`,
      [clientIdNum]
    );
    const clienteRow = clienteRes.rows[0];
    if (!clienteRow) {
      return res.status(400).json({ message: "Cliente não encontrado" });
    }
    const clienteNome = clienteRow.nome;

    // 2) Gerar número
    const seq = await pool.query(
      "SELECT nextval('contratos_ref_seq') AS numero"
    );
    const numSeq = seq.rows[0].numero;
    const ano = new Date(inicio).getFullYear();
    const numero = `CT-${String(numSeq).padStart(4, "0")}/${ano}`;

    // 3) Inserir contrato preenchendo também a coluna "cliente"
    const result = await pool.query(
      `INSERT INTO contratos (
         numero,
         client_id,
         cliente,
         tipo,
         data_inicio,
         data_fim,
         estado
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING
         id,
         numero,
         client_id AS "clientId",
         cliente,
         tipo,
         data_inicio AS "inicio",
         data_fim    AS "fim",
         estado,
         ficheiro    AS "ficheiroNome"`,
      [
        numero,
        clientIdNum,
        clienteNome,
        "Prestação de serviços",
        inicio,
        fim || null,
        estado || "Vigente",
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar contrato:", err.message);
    res
      .status(500)
      .json({ message: "Erro ao criar contrato", error: err.message });
  }
});




// EXTRATO DE CONTA CORRENTE DO CLIENTE
app.get("/clientes/:id/extrato", async (req, res) => {
  const { id } = req.params; // clientId

  try {
    const result = await pool.query(
      `
      SELECT
        v.id,
        v.data,
        v.referencia       AS numero,
        'Factura'          AS tipo,
        v.total_documento  AS valor,
        v.status
      FROM vendas v
      WHERE v.client_id = $1

      UNION ALL

      SELECT
        r.id,
        r.data,
        r.numero           AS numero,
        'Recibo'           AS tipo,
        r.valor            AS valor,
        r.status
      FROM recibos r
      WHERE r.client_id = $1

      ORDER BY data ASC, id ASC
      `,
      [id]
    );

    res.json(result.rows); // [{ id, data, numero, tipo, valor, status }]
  } catch (err) {
    console.error("Erro ao obter extrato:", err);
    res
      .status(500)
      .json({ message: "Erro ao obter extrato", error: err.message });
  }
});




// EXTRATO DE CONTA CORRENTE DO CLIENTE
app.get("/clientes/:id/extrato", async (req, res) => {
  const { id } = req.params; // clientId

  try {
    const result = await pool.query(
      `
      -- FACTURAS (todas)
      SELECT
        v.id,
        v.data,
        v.referencia          AS numero,
        'Factura'             AS tipo,
        v.total_documento     AS valor,
        v.status
      FROM vendas v
      WHERE v.client_id = $1

      UNION ALL

      -- RECIBOS (todos)
      SELECT
        r.id,
        r.data,
        r.numero              AS numero,
        'Recibo'              AS tipo,
        r.valor               AS valor,
        r.status
      FROM recibos r
      WHERE r.client_id = $1

      UNION ALL

      -- PENDENTES (facturas e recibos com status Pendente)
      SELECT
        v2.id,
        v2.data,
        v2.referencia         AS numero,
        'Pendente'            AS tipo,
        v2.total_documento    AS valor,
        v2.status
      FROM vendas v2
      WHERE v2.client_id = $1
        AND v2.status = 'Pendente'

      UNION ALL

      SELECT
        r2.id,
        r2.data,
        r2.numero             AS numero,
        'Pendente'            AS tipo,
        r2.valor              AS valor,
        r2.status
      FROM recibos r2
      WHERE r2.client_id = $1
        AND r2.status = 'Pendente'

      ORDER BY data ASC, id ASC
      `,
      [id]
    );

    res.json(result.rows); // [{ id, data, numero, tipo, valor, status }]
  } catch (err) {
    console.error("Erro ao obter extrato:", err);
    res
      .status(500)
      .json({ message: "Erro ao obter extrato", error: err.message });
  }
});




// LISTAR CONTAS BANCÁRIAS
app.get("/contas-bancarias", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         banco,
         numero,
         tipo,
         moeda,
         saldo_inicial AS "saldoInicial",
         saldo,
         descricao,
         status,
         criado_em     AS "criadoEm"
       FROM contas_bancarias
       ORDER BY id DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar contas bancárias:", err);
    res
      .status(500)
      .json({ message: "Erro ao listar contas bancárias", error: err.message });
  }
});





// CRIAR CONTA BANCÁRIA
app.post("/contas-bancarias", async (req, res) => {
  const {
    banco,
    numero,
    tipo,
    moeda,
    saldoInicial,
    descricao,
    criadoEm,
  } = req.body;

  if (!banco || !numero || saldoInicial == null) {
    return res.status(400).json({
      message: "banco, numero e saldoInicial são obrigatórios",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO contas_bancarias (
         banco,
         numero,
         tipo,
         moeda,
         saldo_inicial,
         saldo,
         descricao,
         status,
         criado_em
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,'Ativa',$8)
       RETURNING
         id,
         banco,
         numero,
         tipo,
         moeda,
         saldo_inicial AS "saldoInicial",
         saldo,
         descricao,
         status,
         criado_em     AS "criadoEm"`,
      [
        banco,
        numero,
        tipo || "Corrente",
        moeda || "MZN",
        saldoInicial,
        saldoInicial,
        descricao || null,
        criadoEm || new Date().toISOString().slice(0, 10),
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar conta bancária:", err);
    res
      .status(500)
      .json({ message: "Erro ao criar conta bancária", error: err.message });
  }
});




// LISTAR DEPÓSITOS
app.get("/depositos", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         d.id,
         d.data,
         d.montante,
         d.moeda,
         d.referencia,
         d.descricao,
         d.status,
         d.conta_id      AS "contaId",
         c.numero        AS "contaNumero",
         c.banco         AS "contaBanco"
       FROM depositos_bancarios d
       JOIN contas_bancarias c ON c.id = d.conta_id
       ORDER BY d.data DESC, d.id DESC`
    );

    // adapta os campos para o DepositoTable
    const rows = result.rows.map((row) => ({
      id: row.id,
      data: row.data, // se quiseres formatar no frontend
      conta: `${row.contaBanco} - ${row.contaNumero}`,
      metodo: row.metodo || "Transferência",
      montante: row.montante,
      moeda: row.moeda,
      status: row.status,
      referencia: row.referencia,
      descricao: row.descricao,
      contaId: row.contaId,
    }));

    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar depósitos:", err);
    res
      .status(500)
      .json({ message: "Erro ao listar depósitos", error: err.message });
  }
});




// CRIAR DEPÓSITO
// ================== DEPÓSITOS ==================

// LISTAR DEPÓSITOS
app.get("/depositos", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         d.id,
         d.data,
         d.montante,
         d.moeda,
         d.referencia,
         d.descricao,
         d.status,
         d.conta_id      AS "contaId",
         c.numero        AS "contaNumero",
         c.banco         AS "contaBanco"
       FROM depositos_bancarios d
       JOIN contas_bancarias c ON c.id = d.conta_id
       ORDER BY d.data DESC, d.id DESC`
    );

    const rows = result.rows.map((row) => ({
      id: row.id,
      data: row.data, // formata no frontend se quiseres
      contaId: row.contaId,
      conta: `${row.contaBanco} - ${row.contaNumero}`,
      montante: row.montante,
      moeda: row.moeda,
      referencia: row.referencia,
      descricao: row.descricao,
      status: row.status,
      metodo: "Depósito",
    }));

    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar depósitos:", err);
    res
      .status(500)
      .json({ message: "Erro ao listar depósitos", error: err.message });
  }
});

// CRIAR DEPÓSITO + ATUALIZAR SALDO DA CONTA
app.post("/depositos", async (req, res) => {
  const { contaId, data, montante, moeda, referencia, descricao, status } =
    req.body;

  if (!contaId) {
    return res.status(400).json({ message: "contaId é obrigatório" });
  }
  if (montante == null || Number.isNaN(Number(montante))) {
    return res.status(400).json({ message: "montante é obrigatório" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1) Inserir depósito
    const result = await client.query(
      `INSERT INTO depositos_bancarios (
         conta_id,
         data,
         montante,
         moeda,
         referencia,
         descricao,
         status
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING
         id,
         conta_id     AS "contaId",
         data,
         montante,
         moeda,
         referencia,
         descricao,
         status`,
      [
        contaId,
        data || new Date().toISOString().slice(0, 10),
        Number(montante),
        moeda || "MZN",
        referencia || null,
        descricao || null,
        status || "Confirmado", // ou "Pendente" se preferires
      ]
    );

    const dep = result.rows[0];

    // 2) Atualizar saldo da conta
    await client.query(
      `UPDATE contas_bancarias
       SET saldo = saldo + $1
       WHERE id = $2`,
      [Number(montante), contaId]
    );

    // 3) Buscar dados da conta para devolver ao frontend
    const contaRes = await client.query(
      `SELECT banco, numero FROM contas_bancarias WHERE id = $1`,
      [dep.contaId]
    );
    const conta = contaRes.rows[0];

    await client.query("COMMIT");

    res.status(201).json({
      id: dep.id,
      data: dep.data,
      contaId: dep.contaId,
      conta: conta ? `${conta.banco} - ${conta.numero}` : "",
      montante: dep.montante,
      moeda: dep.moeda,
      referencia: dep.referencia,
      descricao: dep.descricao,
      status: dep.status,
      metodo: "Depósito",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro ao criar depósito:", err);
    res
      .status(500)
      .json({ message: "Erro ao criar depósito", error: err.message });
  } finally {
    client.release();
  }
});







app.post("/transferencias", async (req, res) => {
  const { origemId, destinoId, data, valor, referencia, descricao } = req.body;

  if (!origemId || !destinoId) {
    return res
      .status(400)
      .json({ message: "origemId e destinoId são obrigatórios" });
  }
  if (origemId === destinoId) {
    return res
      .status(400)
      .json({ message: "Contas de origem e destino devem ser diferentes" });
  }
  if (valor == null || Number.isNaN(Number(valor))) {
    return res.status(400).json({ message: "valor é obrigatório" });
  }

  const origemIdNum = Number(origemId);
  const destinoIdNum = Number(destinoId);
  const valorNum = Number(valor);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const contasRes = await client.query(
      `SELECT id, banco, numero, moeda, saldo
       FROM contas_bancarias
       WHERE id = ANY($1::int[])`,
      [[origemIdNum, destinoIdNum]]
    );

    const origem = contasRes.rows.find((c) => c.id === origemIdNum);
    const destino = contasRes.rows.find((c) => c.id === destinoIdNum);

    if (!origem || !destino) {
      throw new Error("Conta de origem ou destino não encontrada");
    }

    if (origem.moeda !== destino.moeda) {
      throw new Error(
        "Transferência só permitida entre contas com a mesma moeda"
      );
    }

    if (origem.saldo < valorNum) {
      throw new Error("Saldo insuficiente na conta de origem");
    }

    await client.query(
      `UPDATE contas_bancarias
       SET saldo = saldo - $1
       WHERE id = $2`,
      [valorNum, origemIdNum]
    );

    await client.query(
      `UPDATE contas_bancarias
       SET saldo = saldo + $1
       WHERE id = $2`,
      [valorNum, destinoIdNum]
    );

    const insertRes = await client.query(
      `INSERT INTO transferencias_bancarias (
         origem_id,
         destino_id,
         data,
         valor,
         moeda,
         referencia,
         descricao,
         status
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING
         id,
         origem_id   AS "origemId",
         destino_id  AS "destinoId",
         data,
         valor,
         moeda,
         referencia,
         descricao,
         status`,
      [
        origemIdNum,
        destinoIdNum,
        data || new Date().toISOString().slice(0, 10),
        valorNum,
        origem.moeda,
        referencia || null,
        descricao || null,
        "confirmada",
      ]
    );

    const t = insertRes.rows[0];

    await client.query("COMMIT");

    res.status(201).json({
      id: t.id,
      data: t.data,
      origemId: t.origemId,
      destinoId: t.destinoId,
      origem: `${origem.banco} - ${origem.numero}`,
      destino: `${destino.banco} - ${destino.numero}`,
      referencia: t.referencia,
      descricao: t.descricao,
      valor: t.valor,
      moeda: t.moeda,
      status: t.status,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro ao criar transferência:", err);
    res
      .status(500)
      .json({ message: "Erro ao criar transferência", error: err.message });
  } finally {
    client.release();
  }
});



// LISTAR TRANSFERÊNCIAS
app.get("/transferencias", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         t.id,
         t.data,
         t.valor,
         t.moeda,
         t.referencia,
         t.descricao,
         t.status,
         t.origem_id  AS "origemId",
         t.destino_id AS "destinoId",
         co.banco     AS "origemBanco",
         co.numero    AS "origemNumero",
         cd.banco     AS "destinoBanco",
         cd.numero    AS "destinoNumero"
       FROM transferencias_bancarias t
       JOIN contas_bancarias co ON co.id = t.origem_id
       JOIN contas_bancarias cd ON cd.id = t.destino_id
       ORDER BY t.data DESC, t.id DESC`
    );

    const rows = result.rows.map((row) => ({
      id: row.id,
      data: row.data,
      origemId: row.origemId,
      destinoId: row.destinoId,
      origem: `${row.origemBanco} - ${row.origemNumero}`,
      destino: `${row.destinoBanco} - ${row.destinoNumero}`,
      referencia: row.referencia,
      descricao: row.descricao,
      valor: row.valor,
      moeda: row.moeda,
      status: row.status,
    }));

    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar transferências:", err);
    res.status(500).json({
      message: "Erro ao listar transferências",
      error: err.message,
    });
  }
});









// LISTAR PRODUTOS
app.get("/produtos", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         id_item       AS "idItem",
         nome,
         referencia,
         marca,
         categoria,
         unidade,
         tipo,
         venda,
         compra,
         inclui_iva    AS "incluiIva",
         quantidade,
         fornecedor,
         tipo_imposto  AS "tipoImposto",
         preco,
         descricao,
         imagem_path   AS "imagemPath",
         status,
         destaque,
         novo,
         criado_em     AS "criadoEm"
       FROM produtos
       ORDER BY id DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar produtos:", err);
    res
      .status(500)
      .json({ message: "Erro ao listar produtos", error: err.message });
  }
});

// CRIAR PRODUTO
app.post("/produtos", async (req, res) => {
  const {
    idItem,
    nome,
    referencia,
    marca,
    categoria,
    unidade,
    tipo,
    venda,
    compra,
    incluiIva,
    qtyInicial,
    fornecedor,
    tipoImposto,
    preco,
    descricao,
    // imagem: por enquanto ignore, depois fazemos upload
  } = req.body;

  if (!nome || !referencia || preco == null) {
    return res.status(400).json({
      message: "nome, referencia e preco são obrigatórios",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO produtos (
         id_item,
         nome,
         referencia,
         marca,
         categoria,
         unidade,
         tipo,
         venda,
         compra,
         inclui_iva,
         quantidade,
         fornecedor,
         tipo_imposto,
         preco,
         descricao,
         status,
         destaque,
         novo,
         criado_em
       ) VALUES (
         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,
         'Disponível', FALSE, TRUE, CURRENT_DATE
       )
       RETURNING
         id,
         id_item       AS "idItem",
         nome,
         referencia,
         marca,
         categoria,
         unidade,
         tipo,
         venda,
         compra,
         inclui_iva    AS "incluiIva",
         quantidade,
         fornecedor,
         tipo_imposto  AS "tipoImposto",
         preco,
         descricao,
         status,
         destaque,
         novo,
         criado_em     AS "criadoEm"`,
      [
        idItem || null,
        nome,
        referencia,
        marca || null,
        categoria || null,
        unidade || "Unidade",
        tipo || "item",
        venda ?? true,
        compra ?? true,
        incluiIva ?? false,
        qtyInicial ?? 0,
        fornecedor || null,
        tipoImposto || "isento",
        preco,
        descricao || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar produto:", err);
    res
      .status(500)
      .json({ message: "Erro ao criar produto", error: err.message });
  }
});




// GET /movimentos-estoque
app.get("/movimentos-estoque", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         me.id,
         me.produto_id        AS "produtoId",
         me.nome_produto      AS "nome",
         me.referencia,
         me.categoria,
         me.quantidade,
         me.preco_unitario    AS "preco",
         me.status_produto    AS "status",
         me.criado_em         AS "criadoEm"
       FROM movimentos_estoque me
       ORDER BY me.id DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar movimentos de estoque:", err);
    res
      .status(500)
      .json({ message: "Erro ao listar movimentos de estoque", error: err.message });
  }
});

// POST /movimentos-estoque
app.post("/movimentos-estoque", async (req, res) => {
  const { produtoId, quantidade } = req.body;

  if (!produtoId || !quantidade || quantidade <= 0) {
    return res.status(400).json({
      message: "produtoId e quantidade (> 0) são obrigatórios",
    });
  }

  const produtoIdNum = Number(produtoId);
  if (Number.isNaN(produtoIdNum)) {
    return res.status(400).json({ message: "produtoId inválido" });
  }

  try {
    // 1) Buscar produto
    const prodRes = await pool.query(
      `SELECT
         id,
         nome,
         referencia,
         categoria,
         preco,
         status,
         criado_em
       FROM produtos
       WHERE id = $1`,
      [produtoIdNum]
    );

    const produto = prodRes.rows[0];
    if (!produto) {
      return res.status(400).json({ message: "Produto não encontrado" });
    }

    // 2) Inserir movimento de estoque (Entrada)
    const movRes = await pool.query(
      `INSERT INTO movimentos_estoque (
         produto_id,
         tipo,
         quantidade,
         nome_produto,
         referencia,
         categoria,
         preco_unitario,
         status_produto
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING
         id,
         produto_id      AS "produtoId",
         nome_produto    AS "nome",
         referencia,
         categoria,
         quantidade,
         preco_unitario  AS "preco",
         status_produto  AS "status",
         criado_em       AS "criadoEm"`,
      [
        produto.id,
        "Entrada",
        quantidade,
        produto.nome,
        produto.referencia,
        produto.categoria,
        produto.preco,
        produto.status || "Disponível",
      ]
    );

    res.status(201).json(movRes.rows[0]);
  } catch (err) {
    console.error("Erro ao criar movimento de estoque:", err);
    res
      .status(500)
      .json({ message: "Erro ao criar movimento de estoque", error: err.message });
  }
});



// dentro do teu server.js, depois de já ter:
/// const express = require("express");
/// const app = express();
/// const pool = new Pool(...);

// -------- UNIDADES --------

// GET /unidades
app.get("/unidades", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nome, sigla, criado_em FROM unidades ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar unidades:", err);
    res.status(500).json({ error: "Erro ao buscar unidades" });
  }
});

// POST /unidades
app.post("/unidades", async (req, res) => {
  const { nome, sigla } = req.body;
  if (!nome || !sigla) {
    return res
      .status(400)
      .json({ error: "nome e sigla são obrigatórios" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO unidades (nome, sigla)
       VALUES ($1, $2)
       RETURNING id, nome, sigla, criado_em`,
      [nome, sigla]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar unidade:", err);
    res.status(500).json({ error: "Erro ao criar unidade" });
  }
});

// -------- MARCAS --------

// GET /marcas
app.get("/marcas", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nome, criado_em FROM marcas ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar marcas:", err);
    res.status(500).json({ error: "Erro ao buscar marcas" });
  }
});

// POST /marcas
app.post("/marcas", async (req, res) => {
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ error: "nome é obrigatório" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO marcas (nome)
       VALUES ($1)
       RETURNING id, nome, criado_em`,
      [nome]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar marca:", err);
    res.status(500).json({ error: "Erro ao criar marca" });
  }
});

// -------- CATEGORIAS --------

// GET /categorias-item
app.get("/categorias-item", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nome, unidade_sigla, criado_em
       FROM categorias_item
       ORDER BY id DESC`
    );
    const rows = result.rows.map((row) => ({
      id: row.id,
      nome: row.nome,
      unidade: row.unidade_sigla,
      criado_em: row.criado_em,
    }));
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar categorias:", err);
    res.status(500).json({ error: "Erro ao buscar categorias" });
  }
});

// POST /categorias-item
app.post("/categorias-item", async (req, res) => {
  const { nome, unidade_sigla } = req.body;
  if (!nome || !unidade_sigla) {
    return res
      .status(400)
      .json({ error: "nome e unidade_sigla são obrigatórios" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO categorias_item (nome, unidade_sigla)
       VALUES ($1, $2)
       RETURNING id, nome, unidade_sigla, criado_em`,
      [nome, unidade_sigla]
    );

    const row = result.rows[0];
    res.status(201).json({
      id: row.id,
      nome: row.nome,
      unidade: row.unidade_sigla,
      criado_em: row.criado_em,
    });
  } catch (err) {
    console.error("Erro ao criar categoria:", err);
    res.status(500).json({ error: "Erro ao criar categoria" });
  }
});







// --------- IMPOSSOS ---------

app.get("/impostos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nome, taxa, padrao FROM impostos ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar impostos:", err);
    res.status(500).json({ message: "Erro ao listar impostos" });
  }
});

app.post("/impostos", async (req, res) => {
  try {
    const { nome, taxa, padrao } = req.body;

    if (!nome || taxa == null) {
      return res
        .status(400)
        .json({ message: "nome e taxa são obrigatórios" });
    }

    if (padrao) {
      await pool.query("UPDATE impostos SET padrao = FALSE WHERE padrao = TRUE");
    }

    const result = await pool.query(
      `INSERT INTO impostos (nome, taxa, padrao)
       VALUES ($1, $2, $3)
       RETURNING id, nome, taxa, padrao`,
      [nome, Number(taxa), !!padrao]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar imposto:", err);
    res.status(500).json({ message: "Erro ao criar imposto" });
  }
});

// --------- TERMOS DE PAGAMENTO ---------

app.get("/termos-pagamento", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, prazo, dia_devido AS \"diaDevido\", padrao FROM termos_pagamento ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar termos:", err);
    res.status(500).json({ message: "Erro ao listar termos" });
  }
});

app.post("/termos-pagamento", async (req, res) => {
  try {
    const { prazo, diaDevido, padrao } = req.body;

    if (!prazo || diaDevido == null) {
      return res
        .status(400)
        .json({ message: "prazo e diaDevido são obrigatórios" });
    }

    if (padrao) {
      await pool.query(
        "UPDATE termos_pagamento SET padrao = FALSE WHERE padrao = TRUE"
      );
    }

    const result = await pool.query(
      `INSERT INTO termos_pagamento (prazo, dia_devido, padrao)
       VALUES ($1, $2, $3)
       RETURNING id, prazo, dia_devido AS "diaDevido", padrao`,
      [prazo, Number(diaDevido), !!padrao]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar termo:", err);
    res.status(500).json({ message: "Erro ao criar termo" });
  }
});

// --------- TAXAS DE CÂMBIO ---------

app.get("/taxas-cambio", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id,
              data_cambio AS data,
              moeda,
              compra,
              venda,
              estado
         FROM taxas_cambio
        ORDER BY data_cambio DESC, moeda ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar taxas de câmbio:", err);
    res.status(500).json({ message: "Erro ao listar taxas de câmbio" });
  }
});

app.post("/taxas-cambio", async (req, res) => {
  try {
    const { data, moeda, compra, venda, estado } = req.body;

    if (!data || !moeda || compra == null || venda == null) {
      return res.status(400).json({
        message: "data, moeda, compra e venda são obrigatórios",
      });
    }

    const result = await pool.query(
      `INSERT INTO taxas_cambio (data_cambio, moeda, compra, venda, estado)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id,
                 data_cambio AS data,
                 moeda,
                 compra,
                 venda,
                 estado`,
      [data, moeda, Number(compra), Number(venda), estado || "Ativo"]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar taxa de câmbio:", err);
    res.status(500).json({ message: "Erro ao criar taxa de câmbio" });
  }
});

// --------- CONFIGURAÇÃO MOEDA NATIVA ---------

app.get("/config/moeda", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, moeda_padrao AS \"moedaPadrao\", formato FROM configuracao_moeda ORDER BY id ASC LIMIT 1"
    );
    if (result.rows.length === 0) {
      return res.json({
        id: null,
        moedaPadrao: "MZN",
        formato: "1 234,56",
      });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao buscar config de moeda:", err);
    res.status(500).json({ message: "Erro ao buscar config de moeda" });
  }
});

app.put("/config/moeda", async (req, res) => {
  try {
    const { moedaPadrao, formato } = req.body;

    if (!moedaPadrao || !formato) {
      return res
        .status(400)
        .json({ message: "moedaPadrao e formato são obrigatórios" });
    }

    const existing = await pool.query(
      "SELECT id FROM configuracao_moeda LIMIT 1"
    );

    let result;
    if (existing.rows.length === 0) {
      result = await pool.query(
        `INSERT INTO configuracao_moeda (moeda_padrao, formato)
         VALUES ($1, $2)
         RETURNING id, moeda_padrao AS "moedaPadrao", formato`,
        [moedaPadrao, formato]
      );
    } else {
      const id = existing.rows[0].id;
      result = await pool.query(
        `UPDATE configuracao_moeda
            SET moeda_padrao = $1,
                formato      = $2,
                atualizado_em = NOW()
          WHERE id = $3
        RETURNING id, moeda_padrao AS "moedaPadrao", formato`,
        [moedaPadrao, formato, id]
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao salvar config de moeda:", err);
    res.status(500).json({ message: "Erro ao salvar config de moeda" });
  }
});






// POST /cotacoes
app.post("/cotacoes", async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      clienteId,
      referencia,
      moeda,
      venda,
      prazoId,
      data,
      dataFim,
      subTotal,
      descontoTotal,
      impostoTotal,
      totalDocumento,
      status = "Pendente",
      itens = [],
    } = req.body;

    await client.query("BEGIN");

    const insertCotacao = `
      INSERT INTO cotacoes (
        cliente_id, referencia, moeda, venda,
        prazo_id, data, data_fim,
        sub_total, desconto_total, imposto_total, total_documento, status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING
        id,
        cliente_id,
        referencia,
        moeda,
        venda,
        prazo_id,
        data,
        data_fim AS "dataFim",
        sub_total AS "subTotal",
        desconto_total AS "descontoTotal",
        imposto_total AS "impostoTotal",
        total_documento AS "totalDocumento",
        status;
    `;

    const { rows } = await client.query(insertCotacao, [
      clienteId,
      referencia,
      moeda,
      venda,
      prazoId,
      data,
      dataFim || null,
      subTotal,
      descontoTotal,
      impostoTotal,
      totalDocumento,
      status,
    ]);

    const cotacao = rows[0];
    const cotacaoId = cotacao.id;

    const insertItem = `
      INSERT INTO cotacao_itens (
        cotacao_id,
        descricao,
        quant,
        preco_unit,
        iva_id,
        iva_percent,
        iva_valor,
        desconto_percent,
        total
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    `;

    for (const it of itens) {
      await client.query(insertItem, [
        cotacaoId,
        it.descricao,
        it.quant,
        it.precoUnit,
        it.ivaId,
        it.ivaPercent,
        it.ivaValor,
        it.descontoPercent,
        it.total,
      ]);
    }

    await client.query("COMMIT");
    res.status(201).json(cotacao);
  } catch (err) {
    await client.query("ROLLBACK");

    if (err.code === "23505" && err.constraint === "cotacoes_referencia_key") {
      return res
        .status(400)
        .json({ message: "Já existe uma cotação com essa referência." });
    }

    console.error("Erro ao criar cotação:", err);
    res.status(500).json({ message: "Erro ao criar cotação" });
  } finally {
    client.release();
  }
});

// GET /cotacoes
app.get("/cotacoes", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         c.id,
         c.data,
         c.referencia,
         c.sub_total       AS "subTotal",
         c.imposto_total   AS "impostoTotal",
         c.total_documento AS "totalDocumento",
         c.status,
         cl.nome           AS "cliente_nome"
       FROM cotacoes c
       JOIN clients cl ON cl.id = c.cliente_id
       ORDER BY c.id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar cotações:", err);
    res.status(500).json({ message: "Erro ao listar cotações" });
  }
});


// CRIAR VENDA / FATURA
app.post("/vendas", async (req, res) => {
  const {
    clienteId,
    moeda,
    localizacao,
    prazoVencimento,
    data,
    dataFim,
    observacoes,
    numeroRequisicao,
    itens,
    subTotal,
    descontoTotal,
    impostoTotal,
    totalDocumento,
  } = req.body;

  if (!clienteId || !data || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({
      message: "clienteId, data e pelo menos um item são obrigatórios",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const seqResult = await client.query(
      "SELECT nextval('vendas_ref_seq') AS numero"
    );
    const numero = seqResult.rows[0].numero;
    const referencia = `FT-${String(numero).padStart(5, "0")}`;

    const insertVenda = await client.query(
      `INSERT INTO vendas (
        referencia,
        client_id,
        moeda,
        localizacao,
        prazo_vencimento,
        data,
        data_fim,
        observacoes,
        numero_requisicao,
        sub_total,
        desconto_total,
        imposto_total,
        total_documento,
        status,
        criado_em
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'Pendente', CURRENT_DATE)
      RETURNING
        id,
        referencia,
        client_id,
        moeda,
        localizacao,
        prazo_vencimento AS "prazoVencimento",
        data,
        data_fim AS "dataFim",
        observacoes,
        numero_requisicao AS "numeroRequisicao",
        sub_total AS "subTotal",
        desconto_total AS "descontoTotal",
        imposto_total AS "impostoTotal",
        total_documento AS "totalDocumento",
        status,
        criado_em AS "criadoEm"`,
      [
        referencia,
        clienteId,
        moeda || "MZN",
        localizacao || "Armazem",
        prazoVencimento || "Pagamento na Entrega",
        data,
        dataFim || null,
        observacoes || null,
        numeroRequisicao || null,
        subTotal || 0,
        descontoTotal || 0,
        impostoTotal || 0,
        totalDocumento || 0,
      ]
    );

    const venda = insertVenda.rows[0];

    const insertItemQuery = `
      INSERT INTO itens_venda (
        venda_id,
        descricao,
        quantidade,
        preco_unit,
        iva_percent,
        desconto_percent
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING id, descricao, quantidade, preco_unit AS "precoUnit",
                iva_percent AS "ivaPercent",
                desconto_percent AS "descontoPercent"
    `;

    const itensInseridos = [];

    for (const item of itens) {
      const result = await client.query(insertItemQuery, [
        venda.id,
        item.descricao,
        item.quantidade,
        item.precoUnit,
        item.ivaPercent || 0,
        item.descontoPercent || 0,
      ]);
      itensInseridos.push(result.rows[0]);
    }

    await client.query("COMMIT");

    res.status(201).json({
      ...venda,
      itens: itensInseridos,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro ao criar venda:", err);
    res.status(500).json({ message: "Erro ao criar venda", error: err.message });
  } finally {
    client.release();
  }
});


// LISTAR VENDAS PARA O FRONT
app.get("/vendas-tabela", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         v.id,
         v.referencia       AS numero,
         c.nome             AS cliente,
         v.data,
         v.total_documento  AS total,
         v.status           AS estado,
         v.moeda
       FROM vendas v
       JOIN clients c ON c.id = v.client_id
       ORDER BY v.id DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar vendas:", err);
    res.status(500).json({ message: "Erro ao listar vendas" });
  }
});



// ------------- CRÉDITOS -------------
// cria isso perto das outras rotas (depois de vendas/recibos, por exemplo)

// LISTAR CRÉDITOS
app.get("/creditos", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         cr.id,
         cr.data,
         cr.referencia,
         c.nome          AS cliente,
         v.referencia    AS "facturaNumero",
         cr.valor_sem_iva AS "valorSemIva",
         cr.valor_iva     AS "valorIva",
         cr.valor_com_iva AS "valorComIva",
         cr.status
       FROM creditos cr
       JOIN clients c ON c.id = cr.cliente_id
       JOIN vendas  v ON v.id = cr.factura_id
       ORDER BY cr.id DESC`
    );

    res.json(
      result.rows.map((row) => ({
        id: row.id,
        data: row.data,
        referencia: row.referencia,
        cliente: row.cliente,
        facturaNumero: row.facturaNumero,
        valorSemIva: row.valorSemIva,
        valorIva: row.valorIva,
        valorComIva: row.valorComIva,
        status: row.status,
      }))
    );
  } catch (err) {
    console.error("Erro ao listar créditos:", err);
    res
      .status(500)
      .json({ message: "Erro ao listar créditos", error: err.message });
  }
});

// CRIAR CRÉDITO
app.post("/creditos", async (req, res) => {
  const {
    clienteId,
    facturaId,
    referencia,     // ex: NC-2026-01-00001 (já vem do front)
    data,
    localizacao,
    prazoVencimento,
    valorSemIva,
    valorIva,
    valorComIva,
    nota,
    items,
  } = req.body;

  if (!clienteId || !facturaId || !referencia || !data) {
    return res.status(400).json({
      message:
        "clienteId, facturaId, referencia e data são obrigatórios para o crédito",
    });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ message: "Pelo menos um item de crédito é obrigatório" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertCredito = await client.query(
      `INSERT INTO creditos (
         cliente_id,
         factura_id,
         referencia,
         data,
         localizacao,
         prazo_vencimento,
         valor_sem_iva,
         valor_iva,
         valor_com_iva,
         nota,
         status,
         criado_em
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'Ativo',NOW())
       RETURNING
         id,
         cliente_id    AS "clienteId",
         factura_id    AS "facturaId",
         referencia,
         data,
         localizacao,
         prazo_vencimento AS "prazoVencimento",
         valor_sem_iva    AS "valorSemIva",
         valor_iva        AS "valorIva",
         valor_com_iva    AS "valorComIva",
         nota,
         status,
         criado_em       AS "criadoEm"`,
      [
        clienteId,
        facturaId,
        referencia,
        data,
        localizacao || "Armazem",
        prazoVencimento || "Pagamento na Entrega",
        valorSemIva || 0,
        valorIva || 0,
        valorComIva || 0,
        nota || null,
      ]
    );

    const credito = insertCredito.rows[0];

    const insertItemQuery = `
      INSERT INTO itens_credito (
        credito_id,
        descricao,
        quantidade,
        preco_unit,
        iva_percent,
        desconto_percent
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING
        id,
        descricao,
        quantidade,
        preco_unit       AS "precoUnit",
        iva_percent      AS "ivaPercent",
        desconto_percent AS "descontoPercent"
    `;

    const itensInseridos = [];
    for (const item of items) {
      const result = await client.query(insertItemQuery, [
        credito.id,
        item.descricao,
        item.quant,
        item.preco,
        item.ivaPercent || 0,
        item.descontoPercent || 0,
      ]);
      itensInseridos.push(result.rows[0]);
    }

    await client.query("COMMIT");

    res.status(201).json({
      ...credito,
      items: itensInseridos,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro ao criar crédito:", err);
    res
      .status(500)
      .json({ message: "Erro ao criar crédito", error: err.message });
  } finally {
    client.release();
  }
});



// ------------- DÉBITOS -------------

// LISTAR DÉBITOS
app.get("/debitos", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        d.id,
        d.data,
        d.referencia,
        c.nome AS cliente,
        v.referencia AS "facturaNumero",
        d.valor_sem_iva AS "valorSemIva",
        d.valor_iva AS "valorIva",
        d.valor_com_iva AS "valorComIva",
        COALESCE(d.status, 'Ativo') AS status  -- garante status mesmo sem coluna
      FROM debitos d
      JOIN clients c ON c.id = d.cliente_id
      JOIN vendas v ON v.id = d.factura_id
      ORDER BY d.id DESC
    `);

    const rows = result.rows.map((row) => ({
      id: row.id,
      data: row.data,
      referencia: row.referencia,
      cliente: row.cliente,
      facturaNumero: row.facturaNumero,
      valorSemIva: row.valorSemIva,
      valorIva: row.valorIva,
      valorComIva: row.valorComIva,
      status: row.status,
    }));

    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar débitos:", err);
    res.status(500).json({
      message: "Erro ao listar débitos",
      error: err.message,
    });
  }
});

// CRIAR DÉBITO
app.post("/debitos", async (req, res) => {
  const client = await pool.connect();

  const {
    clienteId,
    clienteNome,
    facturaId,
    facturaNumero,
    referencia,       // ND-2026-01-00001
    data,
    localizacao,
    prazoVencimento,
    valorSemIva,
    valorIva,
    valorComIva,
    valor,
    nota,
    items,            // [{ descricao, quant, preco, ivaPercent, descontoPercent }]
  } = req.body;

  if (!clienteId || !facturaId || !referencia || !data) {
    return res.status(400).json({
      message: "clienteId, facturaId, referencia e data são obrigatórios para o débito",
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message: "Pelo menos um item de débito é obrigatório",
    });
  }

  try {
    await client.query("BEGIN");

    // Cabeçalho débito (nomes exatos das tuas colunas)
    const insertDebito = `
      INSERT INTO debitos (
        cliente_id,
        cliente_nome,
        factura_id,
        factura_numero,
        referencia,
        data,
        localizacao,
        prazo_vencimento,
        valor_sem_iva,
        valor_iva,
        valor_com_iva,
        valor,
        nota
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING
        id,
        cliente_id AS "clienteId",
        cliente_nome AS "clienteNome",
        factura_id AS "facturaId",
        factura_numero AS "facturaNumero",
        referencia,
        data,
        localizacao,
        prazo_vencimento AS "prazoVencimento",
        valor_sem_iva AS "valorSemIva",
        valor_iva AS "valorIva",
        valor_com_iva AS "valorComIva",
        valor,
        nota
    `;

    const debitoValues = [
      clienteId,
      clienteNome || null,
      facturaId,
      facturaNumero || null,
      referencia,
      data,
      localizacao || "Armazem",
      prazoVencimento || "Pagamento na Entrega",
      valorSemIva ?? 0,
      valorIva ?? 0,
      valorComIva ?? 0,
      valor ?? valorComIva ?? 0,
      nota || null,
    ];

    const debitoResult = await client.query(insertDebito, debitoValues);
    const debito = debitoResult.rows[0];

    // Itens débito (nomes exatos das tuas colunas)
    const insertItemQuery = `
      INSERT INTO debito_items (
        debito_id,
        descricao,
        quant,
        preco,
        iva_percent,
        desconto_percent
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING
        id,
        descricao,
        quant,
        preco,
        iva_percent AS "ivaPercent",
        desconto_percent AS "descontoPercent"
    `;

    const itensInseridos = [];

    for (const item of items) {
      const result = await client.query(insertItemQuery, [
        debito.id,
        item.descricao,
        item.quant,
        item.preco,
        item.ivaPercent || 0,
        item.descontoPercent || 0,
      ]);
      itensInseridos.push(result.rows[0]);
    }

    await client.query("COMMIT");

    res.status(201).json({
      ...debito,
      status: "Ativo",  // adiciona status no response
      items: itensInseridos,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro ao criar débito:", err);
    res.status(500).json({
      message: "Erro ao criar débito",
      error: err.message,
    });
  } finally {
    client.release();
  }
});










// ================ SUBSTITUA AS 4 ROTAS POR ESTAS ================

// GET /api/entregas - SIMPLIFICADO (sem JOINs problemáticos)
app.get('/api/entregas', async (req, res) => {
  try {
    const { search } = req.query;
    let query = `
      SELECT id, cliente_nome, factura_numero, referencia, data, 
             local_entrega, motorista_nome, valor, status, nota, criado_em
      FROM entregas
    `;
    let params = [];

    if (search) {
      query += ` WHERE referencia ILIKE $1 OR cliente_nome ILIKE $1 OR 
                 motorista_nome ILIKE $1 OR factura_numero ILIKE $1`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY data DESC, id DESC';
    
    const entregas = await pool.query(query, params);
    res.json(entregas.rows);
  } catch (error) {
    console.error('Erro ao listar entregas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/entregas - VERIFICADO
app.post('/api/entregas', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      clienteId, cliente, facturaId, facturaNumero, referencia, data,
      localEntrega, motoristaNome, cartaConducao, matriculaCarro,
      valorSemIva, valorIva, valorComIva, valor, nota, items
    } = req.body;

    // Inserir entrega principal
    const entregaResult = await client.query(
      `INSERT INTO entregas (
        cliente_id, cliente_nome, factura_id, factura_numero, referencia,
        data, local_entrega, motorista_nome, carta_conducao, matricula_carro,
        valor_sem_iva, valor_iva, valor_com_iva, valor, nota, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'Pendente')
      RETURNING id`,
      [
        clienteId, cliente, facturaId, facturaNumero, referencia, data,
        localEntrega, motoristaNome, cartaConducao, matriculaCarro,
        valorSemIva, valorIva, valorComIva, valor, nota
      ]
    );

    const entregaId = entregaResult.rows[0].id;

    // Inserir items
    if (items && items.length > 0) {
      for (const item of items) {
        await client.query(
          `INSERT INTO entrega_items (entrega_id, descricao, quant, preco, iva_percent, desconto_percent)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            entregaId, item.descricao, item.quant, item.preco,
            item.ivaPercent || 0, item.descontoPercent || 0
          ]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json({ id: entregaId, mensagem: 'Entrega criada com sucesso' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar entrega:', error);
    res.status(400).json({ error: error.message || 'Erro ao criar entrega' });
  } finally {
    client.release();
  }
});








// GET /api/entregas/:id
app.get('/api/entregas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const entrega = await pool.query(
      'SELECT * FROM entregas WHERE id = $1',
      [id]
    );

    if (entrega.rows.length === 0) {
      return res.status(404).json({ error: 'Entrega não encontrada' });
    }

    res.json(entrega.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar entrega:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});


// DELETE /api/entregas/:id
app.delete('/api/entregas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM entregas WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entrega não encontrada' });
    }

    res.json({ message: 'Entrega deletada' });
  } catch (error) {
    console.error('Erro ao deletar:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});












// GET /api/transportes (com search + nomes que o React entende)
app.get('/api/transportes', async (req, res) => {
  try {
    const { search } = req.query;
    let query = `
      SELECT 
        id,
        referencia,
        data,
        cliente_nome   AS cliente,
        local_entrega  AS "localEntrega",
        motorista_nome AS "motoristaNome",
        valor,
        status,
        moeda
      FROM transportes
    `;
    const params = [];

    if (search) {
      query += ` 
        WHERE referencia ILIKE $1
           OR cliente_nome ILIKE $1
           OR motorista_nome ILIKE $1
           OR factura_numero ILIKE $1
      `;
      params.push('%' + search + '%');
    }

    query += ' ORDER BY data DESC, id DESC';

    const transportes = await pool.query(query, params);
    res.json(transportes.rows);
  } catch (error) {
    console.error('Erro ao listar transportes:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});


// POST /api/transportes
app.post('/api/transportes', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      clienteId, cliente, facturaId, facturaNumero, vendaId, referencia, data,
      moeda, localEntrega, motoristaNome, cartaConducao, matriculaCarro,
      valorSemIva, valorIva, valorComIva, valor, nota, items
    } = req.body;

    const transporteResult = await client.query(
      `INSERT INTO transportes (
        cliente_id, cliente_nome, factura_id, factura_numero, venda_id,
        referencia, data, moeda, local_entrega, motorista_nome, 
        carta_conducao, matricula_carro, valor_sem_iva, valor_iva, 
        valor_com_iva, valor, nota, status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,'Pendente')
      RETURNING id`,
      [
        clienteId, cliente, facturaId, facturaNumero, vendaId, referencia, data,
        moeda, localEntrega, motoristaNome, cartaConducao, matriculaCarro,
        valorSemIva, valorIva, valorComIva, valor, nota
      ]
    );

    const transporteId = transporteResult.rows[0].id;

    if (items && items.length > 0) {
      for (const item of items) {
        await client.query(
          `INSERT INTO transporte_items (
            transporte_id, descricao, quant, preco, iva_percent, desconto_percent
          ) VALUES ($1,$2,$3,$4,$5,$6)`,
          [
            transporteId,
            item.descricao,
            item.quant,
            item.preco,
            item.ivaPercent || 0,
            item.descontoPercent || 0
          ]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json({ id: transporteId, mensagem: 'Transporte criado!' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar transporte:', error);
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
});


app.get("/categorias-despesas", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nome, tipo
       FROM categorias_despesas
       ORDER BY id DESC`
    );

    const rows = result.rows.map((row) => ({
      id: row.id,
      nome: row.nome,
      tipo: row.tipo,
    }));

    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar categorias de despesas:", err);
    res
      .status(500)
      .json({ error: "Erro ao listar categorias de despesas" });
  }
});
app.post("/categorias-despesas", async (req, res) => {
  const { nome, tipo } = req.body;

  if (!nome || !tipo) {
    return res
      .status(400)
      .json({ error: "nome e tipo são obrigatórios" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO categorias_despesas (nome, tipo)
       VALUES ($1, $2)
       RETURNING id, nome, tipo`,
      [nome, tipo]
    );

    const row = result.rows[0];

    res.status(201).json({
      id: row.id,
      nome: row.nome,
      tipo: row.tipo,
    });
  } catch (err) {
    console.error("Erro ao criar categoria de despesa:", err);
    res
      .status(500)
      .json({ error: "Erro ao criar categoria de despesa" });
  }
});



// -------- DESPESAS --------

// LISTAR DESPESAS
app.get("/despesas", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         d.id,
         d.conta_id       AS "contaId",
         d.fornecedor_id  AS "fornecedorId",
         d.categoria,
         d.descricao,
         d.total,
         d.moeda,
         d.data,
         d.status,
         d.anexo_path     AS "anexoPath",
         d.criado_em      AS "criadoEm"
       FROM despesas d
       ORDER BY d.data DESC, d.id DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar despesas:", err);
    res
      .status(500)
      .json({ message: "Erro ao listar despesas", error: err.message });
  }
});

// CRIAR DESPESA
app.post("/despesas", async (req, res) => {
  try {
    const {
      contaId,
      fornecedorId,
      categoria,
      descricao,
      total,
      moeda,
      data,
      // anexo: depois podes tratar upload e salvar path
    } = req.body;

    if (!contaId || !fornecedorId || total == null || !data) {
      return res.status(400).json({
        message: "contaId, fornecedorId, total e data são obrigatórios",
      });
    }

    const result = await pool.query(
      `INSERT INTO despesas (
         conta_id,
         fornecedor_id,
         categoria,
         descricao,
         total,
         moeda,
         data,
         status,
         anexo_path
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,'Pendente',NULL)
       RETURNING
         id,
         conta_id      AS "contaId",
         fornecedor_id AS "fornecedorId",
         categoria,
         descricao,
         total,
         moeda,
         data,
         status,
         anexo_path    AS "anexoPath",
         criado_em     AS "criadoEm"`,
      [
        contaId,
        fornecedorId,
        categoria || null,
        descricao || null,
        total,
        moeda || "MZN",
        data,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar despesa:", err);
    res
      .status(500)
      .json({ message: "Erro ao criar despesa", error: err.message });
  }
});












// CRIAR ORDEM
app.post("/ordens", async (req, res) => {
  const {
    numero,
    clienteId,
    contaOrigemId,
    contaOrigemLivre,
    contaDestinoId,
    contaDestinoLivre,
    descricao,
    valor,
    moeda,
    status,
    data,
  } = req.body;

  if (!numero || !clienteId || valor == null) {
    return res.status(400).json({
      message: "numero, clienteId e valor são obrigatórios",
    });
  }

  // garante tipos corretos para o banco
  const clienteIdInt =
    clienteId === null || clienteId === undefined ? null : Number(clienteId);
  const contaOrigemIdInt =
    contaOrigemId && contaOrigemId !== "OUTRA"
      ? Number(contaOrigemId)
      : null;
  const contaDestinoIdInt =
    contaDestinoId && contaDestinoId !== "OUTRA"
      ? Number(contaDestinoId)
      : null;

  try {
    const result = await pool.query(
      `INSERT INTO ordens (
         numero,
         cliente_id,
         conta_origem_id,
         conta_origem_livre,
         conta_destino_id,
         conta_destino_livre,
         descricao,
         valor,
         moeda,
         status,
         data,
         criado_em
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11, NOW())
       RETURNING
         id,
         numero,
         cliente_id         AS "clienteId",
         conta_origem_id    AS "contaOrigemId",
         conta_origem_livre AS "contaOrigemLivre",
         conta_destino_id   AS "contaDestinoId",
         conta_destino_livre AS "contaDestinoLivre",
         descricao,
         valor,
         moeda,
         status,
         data,
         criado_em          AS "criadoEm"`,
      [
        numero,
        clienteIdInt,
        contaOrigemIdInt,
        contaOrigemIdInt ? null : contaOrigemLivre || null,
        contaDestinoIdInt,
        contaDestinoIdInt ? null : contaDestinoLivre || null,
        descricao || null,
        Number(valor),
        moeda || "MZN",
        status || "aberta",
        data || new Date().toISOString().slice(0, 10),
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar ordem:", err);
    return res
      .status(500)
      .json({ message: "Erro ao criar ordem", error: err.message });
  }
});

// LISTAR ORDENS
app.get("/ordens", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         o.id,
         o.numero,
         c.nome AS cliente,
         COALESCE(
           (SELECT cb.banco || ' - ' || cb.numero
            FROM contas_bancarias cb
            WHERE cb.id = o.conta_origem_id),
           o.conta_origem_livre
         ) AS "contaOrigem",
         COALESCE(
           (SELECT cb2.banco || ' - ' || cb2.numero
            FROM contas_bancarias cb2
            WHERE cb2.id = o.conta_destino_id),
           o.conta_destino_livre
         ) AS "contaDestino",
         o.valor,
         o.moeda,
         o.status,
         o.data::text AS "data"
       FROM ordens o
       JOIN clients c ON c.id = o.cliente_id
       ORDER BY o.id DESC`
    );

    return res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar ordens:", err);
    return res
      .status(500)
      .json({ message: "Erro ao listar ordens", error: err.message });
  }
});







// ------------- DEVOLUÇÕES -------------
// CRIAR DEVOLUÇÃO
app.post("/devolucoes", async (req, res) => {
  const {
    data,
    clienteId,
    contaId,
    contaLivre,
    referencia,
    valor,
    moeda,
    status,
    observacoes,
  } = req.body;

  if (!data || !clienteId || valor == null || !referencia) {
    return res.status(400).json({
      message: "data, clienteId, valor e referencia são obrigatórios",
    });
  }

  const clienteIdNum = Number(clienteId);
  const contaIdNum =
    contaId && contaId !== "OUTRA" ? Number(contaId) : null;

  try {
    const result = await pool.query(
      `INSERT INTO devolucoes (
         data,
         cliente_id,
         conta_id,
         conta_livre,
         referencia,
         valor,
         moeda,
         status,
         observacoes,
         created_at,
         updated_at
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),NOW())
       RETURNING
         id,
         data,
         cliente_id    AS "clienteId",
         conta_id      AS "contaId",
         conta_livre   AS "contaLivre",
         referencia,
         valor,
         moeda,
         status,
         observacoes,
         created_at    AS "createdAt",
         updated_at    AS "updatedAt"`,
      [
        data,
        clienteIdNum,
        contaIdNum,
        contaIdNum ? null : contaLivre || null,
        referencia,
        Number(valor),
        moeda || "MZN",
        status || "pendente",
        observacoes || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar devolução:", err);
    res
      .status(500)
      .json({ message: "Erro ao criar devolução", error: err.message });
  }
});

// LISTAR DEVOLUÇÕES (para a tabela)
app.get("/devolucoes", async (req, res) => {
  const { clienteId } = req.query;

  try {
    const params = [];
    let where = "";

    if (clienteId) {
      where = "WHERE d.cliente_id = $1";
      params.push(clienteId);
    }

    const result = await pool.query(
      `SELECT
         d.id,
         d.data::text               AS "data",
         d.referencia,
         d.valor,
         d.moeda,
         d.status,
         d.conta_livre              AS "contaLivre",
         d.conta_id                 AS "contaId",
         c.nome                     AS "cliente",
         COALESCE(
           (SELECT cb.banco || ' - ' || cb.numero
            FROM contas_bancarias cb
            WHERE cb.id = d.conta_id),
           d.conta_livre
         )                           AS "conta"
       FROM devolucoes d
       JOIN clients c ON c.id = d.cliente_id
       ${where}
       ORDER BY d.id DESC`,
      params
    );

    res.json(
      result.rows.map((row) => ({
        id: row.id,
        data: row.data,
        cliente: row.cliente,
        conta: row.conta,
        referencia: row.referencia,
        valor: Number(row.valor),
        moeda: row.moeda,
        status: row.status,
      }))
    );
  } catch (err) {
    console.error("Erro ao listar devoluções:", err);
    res
      .status(500)
      .json({ message: "Erro ao listar devoluções", error: err.message });
  }
});




// RELATÓRIO DE CLIENTES
app.get("/relatorios-clientes", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        c.id,
        c.nome                              AS cliente,
        COALESCE(c.cidade, '')              AS cidade,
        COALESCE(c.provincia, '')           AS provincia,
        COALESCE(c.status, 'Ativo')         AS estado,
        COALESCE(SUM(v.total_documento),0)  AS "totalFaturado",
        COALESCE(MAX(v.data), c.criado_em)  AS "ultimaCompra",
        c.criado_em                         AS data
      FROM clients c
      LEFT JOIN vendas v ON v.client_id = c.id
      GROUP BY c.id, c.nome, c.cidade, c.provincia, c.status, c.criado_em
      ORDER BY c.id DESC
      `
    );

    const rows = result.rows.map((row) => ({
      id: row.id,
      data: row.data,
      cliente: row.cliente,
      segmento: row.cidade || row.provincia || "Geral",
      totalFaturado: Number(row.totalFaturado),
      estado: row.estado.toLowerCase(), // "ativo", "inativo"...
      ultimaCompra: row.ultimaCompra,
    }));

    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar relatórios de clientes:", err);
    res
      .status(500)
      .json({ message: "Erro ao listar relatórios de clientes", error: err.message });
  }
});

// RESUMO RELATÓRIOS CLIENTES (dados fictícios ou de query real)
app.get('/api/relatorios-clientes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.nome AS cliente,
        COALESCE(c.segmento, 'Geral') AS segmento,
        COALESCE(SUM(v.totaldocumento), 0) AS totalFaturado,
        c.status AS estado,
        MAX(v.data) AS ultimaCompra,
        CURRENT_DATE AS data
      FROM clients c 
      LEFT JOIN vendas v ON v.clientid = c.id 
      GROUP BY c.id, c.nome, c.segmento, c.status
      ORDER BY ultimaCompra DESC NULLS LAST
    `);
    res.json(result.rows.map(r => ({
      ...r,
      totalFaturado: Number(r.totalfaturado),
      data: r.data?.toISOString().slice(0,10) || '',
      ultimaCompra: r.ultimacompra?.toISOString().slice(0,10) || 'Nunca'
    })));
  } catch (err) {
    console.error('Erro relatórios:', err);
    res.status(500).json({ error: 'Erro nos relatórios' });
  }
});


app.get("/rel-despesas", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        d.id,
        d.data,
        cb.banco || ' - ' || cb.numero AS conta,
        d.categoria,
        d.total AS valor,    -- <====== aqui trocado
        d.status
      FROM despesas d
      JOIN contas_bancarias cb ON cb.id = d.conta_id
      ORDER BY d.data DESC, d.id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar relatorio de despesas:", err);
    res.status(500).json({ message: "Erro ao listar relatorio de despesas" });
  }
});




app.get("/rel-pendentes", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        v.id,
        v.data,
        c.nome        AS cliente,
        v.referencia,
        v.total_documento AS valor,
        'Factura'     AS tipo,
        v.status
      FROM vendas v
      JOIN clients c ON c.id = v.client_id
      WHERE v.status = 'Pendente'
      ORDER BY v.data ASC, v.id ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar pendentes:", err);
    res.status(500).json({ message: "Erro ao listar pendentes" });
  }
});











// CRIAR PRODUTO (com preço de compra e lucro unitário)
app.post("/produtos", async (req, res) => {
  const {
    idItem,
    nome,
    referencia,
    marca,
    categoria,
    unidade,
    tipo,
    venda,
    compra,
    incluiIva,
    qtyInicial,
    fornecedor,
    tipoImposto,
    preco,        // venda
    precoCompra,  // novo campo vindo do front
    descricao,
  } = req.body;

  if (!nome || !referencia || preco == null) {
    return res.status(400).json({
      message: "nome, referencia e preco são obrigatórios",
    });
  }

  const precoCompraNum = Number(precoCompra) || 0;
  const precoVendaNum = Number(preco) || 0;
  const lucroUnit = precoVendaNum - precoCompraNum;
  const margemUnit =
    precoVendaNum > 0 ? (lucroUnit / precoVendaNum) * 100 : 0;

  try {
    const result = await pool.query(
      `INSERT INTO produtos (
         id_item,
         nome,
         referencia,
         marca,
         categoria,
         unidade,
         tipo,
         venda,
         compra,
         inclui_iva,
         quantidade,
         fornecedor,
         tipo_imposto,
         preco,
         preco_compra,
         lucro_unit,
         margem_unit,
         descricao,
         status,
         destaque,
         novo,
         criado_em
       ) VALUES (
         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,
         'Disponível', FALSE, TRUE, CURRENT_DATE
       )
       RETURNING
         id,
         id_item       AS "idItem",
         nome,
         referencia,
         marca,
         categoria,
         unidade,
         tipo,
         venda,
         compra,
         inclui_iva    AS "incluiIva",
         quantidade,
         fornecedor,
         tipo_imposto  AS "tipoImposto",
         preco,
         preco_compra  AS "precoCompra",
         lucro_unit    AS "lucroUnit",
         margem_unit   AS "margemUnit",
         descricao,
         status,
         destaque,
         novo,
         criado_em     AS "criadoEm"`,
      [
        idItem || null,
        nome,
        referencia,
        marca || null,
        categoria || null,
        unidade || "Unidade",
        tipo || "item",
        venda ?? true,
        compra ?? true,
        incluiIva ?? false,
        qtyInicial ?? 0,
        fornecedor || null,
        tipoImposto || "isento",
        precoVendaNum,
        precoCompraNum,
        lucroUnit,
        margemUnit,
        descricao || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar produto:", err);
    res
      .status(500)
      .json({ message: "Erro ao criar produto", error: err.message });
  }
});




// DASHBOARD FINANCEIRO: ganhos, despesas, lucros
app.get("/api/dashboard", async (req, res) => {
  try {
    // somatório de vendas (ganhos) e lucro_total
    const { rows: vendasResumo } = await pool.query(`
      SELECT
        COALESCE(SUM(total_documento), 0) AS ganhos,
        COALESCE(SUM(lucro_total), 0)     AS lucros
      FROM vendas
      WHERE status <> 'Cancelada'
    `);

    // se tiver tabela de despesas (ajusta o nome/tabela conforme seu banco)
    let despesasTotal = 0;
    try {
      const { rows } = await pool.query(`
        SELECT COALESCE(SUM(total), 0) AS total
        FROM despesas
      `);
      despesasTotal = Number(rows[0].total);
    } catch (e) {
      // se ainda não tiver tabela despesas, pode ignorar esse bloco
      console.warn("Tabela de despesas não encontrada (opcional)");
    }

    const stats = {
      ganhos: Number(vendasResumo[0].ganhos),
      lucros: Number(vendasResumo[0].lucros),
      despesas: despesasTotal,
    };

    res.json({ stats });
  } catch (err) {
    console.error("Erro ao montar dashboard:", err);
    res.status(500).json({ message: "Erro ao montar dashboard" });
  }
});



// DASHBOARD FINANCEIRO: ganhos, despesas, lucros
app.get("/api/dashboard", async (req, res) => {
  try {
    const { rows: vendasResumo } = await pool.query(`
      SELECT
        COALESCE(SUM(total_documento), 0) AS ganhos,
        COALESCE(SUM(lucro_total), 0)     AS lucros
      FROM vendas
      WHERE status <> 'Cancelada'
    `);

    let despesasTotal = 0;
    try {
      const { rows } = await pool.query(`
        SELECT COALESCE(SUM(total), 0) AS total
        FROM despesas
      `);
      despesasTotal = Number(rows[0].total);
    } catch (e) {
      console.warn("Tabela de despesas não encontrada (opcional)");
    }

    const stats = {
      ganhos: Number(vendasResumo[0].ganhos),
      lucros: Number(vendasResumo[0].lucros),
      despesas: despesasTotal,
    };

    res.json({ stats });
  } catch (err) {
    console.error("Erro ao montar dashboard:", err);
    res.status(500).json({ message: "Erro ao montar dashboard" });
  }
});






// FLUXO FINANCEIRO POR MÊS (para o FinancialChart)
app.get("/api/dashboard/fluxo", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        TO_CHAR(data, 'YYYY-MM')     AS mes,
        COALESCE(SUM(total_documento), 0) AS ganhos,
        COALESCE(SUM(lucro_total), 0)     AS lucros
      FROM vendas
      WHERE status <> 'Cancelada'
      GROUP BY TO_CHAR(data, 'YYYY-MM')
      ORDER BY mes
    `);

    // despesas por mês (se tiver tabela despesas com coluna data)
    let despesasPorMes = {};
    try {
      const { rows: rowsDespesas } = await pool.query(`
        SELECT
          TO_CHAR(data, 'YYYY-MM') AS mes,
          COALESCE(SUM(total), 0)  AS despesas
        FROM despesas
        GROUP BY TO_CHAR(data, 'YYYY-MM')
      `);

      despesasPorMes = rowsDespesas.reduce((acc, row) => {
        acc[row.mes] = Number(row.despesas);
        return acc;
      }, {});
    } catch (e) {
      console.warn("Tabela de despesas não encontrada (opcional)");
    }

    const series = rows.map((row) => ({
      mes: row.mes,
      ganhos: Number(row.ganhos),
      lucros: Number(row.lucros),
      despesas: despesasPorMes[row.mes] ?? 0,
    }));

    res.json({ series });
  } catch (err) {
    console.error("Erro ao montar fluxo financeiro:", err);
    res
      .status(500)
      .json({ message: "Erro ao montar fluxo financeiro" });
  }
});



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API a correr na porta ${PORT}`);
});
