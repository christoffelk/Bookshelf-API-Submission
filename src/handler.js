const { nanoid, urlAlphabet } = require('nanoid');
const bookss = require('./book');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(16);
  let finished = false;
  if (pageCount === readPage) {
    finished = true;
  } else {
    finished = false;
  }
  if (readPage > pageCount) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      },
    );
    response.code(400);
    return response;
  }
  if (name === undefined) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      },
    );
    response.code(400);
    return response;
  }
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const databuku = {
    id,
    name,
    publisher,
    year,
    summary,
    author,
    finished,
    pageCount,
    readPage,
    reading,
    insertedAt,
    updatedAt,
  };

  bookss.push(databuku);
  const isSuccess = bookss.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response(
      {
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data:
        {
          bookId: id,
        },
      },
    );
    response.code(201);
    return response;
  }

  const response = h.response(
    {
      status: 'error',
      message: 'Buku gagal ditambahan',
    },
  );
  response.code(500);
  return response;
};
const getAllBookHandler = (request,h) => {
  if(request.query.reading)
  {
    let status = request.query.reading;
    if(status == 1)
    {
      status = true;
    }
    else{
      status = false;
    }
  }
  const books= bookss.map((entry) => ({ id: entry.id, name: entry.name, publisher: entry.publisher }));
  return h.response({
    status: 'success',
    data: {
      books,
    },
  }).code(200);
};
const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = bookss.filter((b) => b.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response(
    {
      status: 'fail',
      message: 'Buku tidak ditemukan',
    },
  );
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = bookss.findIndex(((book) => book.id === id));
  let finished = false;
  if (pageCount === readPage) {
    finished = true;
  } else {
    finished = false;
  }
  if (readPage > pageCount) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      },
    );
    response.code(400);
    return response;
  }
  if (name === undefined) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      },
    );
    response.code(400);
    return response;
  }

  if (index !== -1) {
    bookss[index] = {
      ...bookss[index],
      name,
      publisher,
      year,
      author,
      summary,
      readPage,
      pageCount,
      reading,
      finished,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = bookss.findIndex(((book) => book.id === id));
  if (index !== -1) {
    bookss.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
module.exports = {
  addBookHandler, getAllBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler,
};
