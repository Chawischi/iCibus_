const app = require('../app'); 
const db = require('../models');
const { Restaurante, Categoria } = db;

describe('Restaurante API', () => {
  let restauranteId;
  let categoriaId;

  beforeAll(async () => {
    // Limpar tabelas para ambiente de teste
    await Restaurante.destroy({ where: {}, truncate: true });
    await Categoria.destroy({ where: {}, truncate: true });

    // Criar uma categoria para associar nos testes
    const categoria = await Categoria.create({ id: 'test-cat-1', nome: 'Teste Categoria' });
    categoriaId = categoria.id;
  });

  afterAll(async () => {
    await db.sequelize.close(); // fechar conexão com banco após testes
  });

  it('Deve criar um restaurante com categoria', async () => {
    const res = await request(app)
      .post('/restaurantes')
      .field('nome', 'Restaurante Teste')
      .field('telefone', '123456789')
      .field('endereco', 'Rua Teste, 123')
      .field('horario', '9h às 18h')
      .field('sobreNos', 'Um restaurante para testes')
      .field('categoriaIds[]', categoriaId)
      .attach('imagem', 'tests/files/imagem-teste.jpg'); // precisa ter uma imagem de teste neste caminho

    expect(res.statusCode).toBe(201);
    expect(res.body.restaurante.nome).toBe('Restaurante Teste');
    expect(res.body.restaurante.Categorias).toBeDefined();
    expect(res.body.restaurante.Categorias.length).toBeGreaterThan(0);

    restauranteId = res.body.restaurante.id;
  });

  it('Deve listar todos os restaurantes', async () => {
    const res = await request(app).get('/restaurantes');
    expect(res.statusCode).toBe(200);
    expect(res.body.restaurantes).toBeInstanceOf(Array);
    expect(res.body.restaurantes.length).toBeGreaterThan(0);
  });

  it('Deve buscar restaurante por ID', async () => {
    const res = await request(app).get(`/restaurantes/${restauranteId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.restaurante.id).toBe(restauranteId);
  });

  it('Deve atualizar restaurante', async () => {
    const novoNome = 'Restaurante Atualizado';
    const res = await request(app)
      .put(`/restaurantes/${restauranteId}`)
      .send({ nome: novoNome, categoriaIds: [categoriaId] });

    expect(res.statusCode).toBe(200);
    expect(res.body.nome).toBe(novoNome);
    expect(res.body.Categorias.length).toBeGreaterThan(0);
  });

  it('Deve deletar restaurante', async () => {
    const res = await request(app).delete(`/restaurantes/${restauranteId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Restaurante deletado com sucesso');

    // Confirmar que não existe mais
    const busca = await request(app).get(`/restaurantes/${restauranteId}`);
    expect(busca.statusCode).toBe(404);
  });
});
