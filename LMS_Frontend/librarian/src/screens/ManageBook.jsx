import { useEffect, useState } from "react";
import apiClient from "../api/ApiClient";

const ManageBook = () => {
  // Mock Data with new fields
  //   const initialBooks = [
  //     {
  //       id: 1,
  //       name: "Dune",
  //       author: "Frank Herbert",
  //       subject: "Science Fiction",
  //       isbn: "978-0441013593",
  //       copies: 5,
  //       borrowed: 2,
  //       available: 3,
  //     },
  //     {
  //       id: 2,
  //       name: "The Midnight Library",
  //       author: "Matt Haig",
  //       subject: "Fantasy",
  //       isbn: "978-0735211292",
  //       copies: 3,
  //       borrowed: 1,
  //       available: 2,
  //     },
  //     {
  //       id: 3,
  //       name: "Project Hail Mary",
  //       author: "Andy Weir",
  //       subject: "Science Fiction",
  //       isbn: "978-0593135204",
  //       copies: 8,
  //       borrowed: 4,
  //       available: 4,
  //     },
  //     {
  //       id: 4,
  //       name: "Klara and the Sun",
  //       author: "Kazuo Ishiguro",
  //       subject: "Science Fiction",
  //       isbn: "978-0593318171",
  //       copies: 2,
  //       borrowed: 1,
  //       available: 1,
  //     },
  //   ];

  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'addCopy' or 'update'
  const [selectedBook, setSelectedBook] = useState(null);
  const [rackNumber, setRackNumber] = useState("");
  const [editForm, setEditForm] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    const response = await apiClient.get("/getAllBooks");
    console.log(response.data.data);
    setBooks(response.data.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddCopy = (book) => {
    setSelectedBook(book);
    setModalType("addCopy");
    setShowModal(true);
  };

  const handleUpdate = (book) => {
    setSelectedBook(book);
    setEditForm(book);
    setModalType("update");
    setShowModal(true);
  };

  const handleDelete = (bookId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this book? This action cannot be undone."
      )
    ) {
      setBooks(books.filter((b) => b.id !== bookId));
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setRackNumber("");
    setSelectedBook(null);
  };

  const handleAddCopySubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      book_id: selectedBook.id,
      rack: rackNumber,
    };

    try {
      const response = await apiClient.post("/addBookCopy", payload);
      //   console.log(response.data.data);
      if (response.data.data === "1") {
        setSuccess("New Copy Added Successfully!!");
        // console.log("New Copy Added Successfully!!");
      }
    } catch (error) {
      setError("Something Went Wrong...");
    }

    handleModalClose();
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // setBooks(books.map((b) => (b.id === selectedBook.id ? editForm : b)));

    const payload = {
      name: editForm.name,
      author: editForm.author,
      subject: editForm.subject,
      price: editForm.price,
      isbn: editForm.isbn,
    };

    // console.log("ALL BOOKS DATA: " + editForm);

    // console.log("id: " + editForm.id);
    // console.log("name: " + editForm.name);
    // console.log("author: " + editForm.author);
    // console.log("subject: " + editForm.subject);
    // console.log("price: " + editForm.price);
    // console.log("isbn: " + editForm.isbn);

    try {
      const response = await apiClient.put(
        `/updateBook/${editForm.id}`,
        payload
      );

      //   console.log(response.data.status);

      if (response.data.status === "success")
        setSuccess("Book Updated SuccessFully!!!");
    } catch (error) {
      setError("Something Went Wrong...");
    } finally {
      handleModalClose();
    }
  };

  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  //   Filter books based on search query
  const filteredBooks = books.filter((book) => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return (
      book.name.toLowerCase().includes(lowercasedQuery) ||
      book.author.toLowerCase().includes(lowercasedQuery) ||
      book.isbn.includes(searchQuery) ||
      book.subject.toLowerCase().includes(lowercasedQuery)
    );
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Manage Books</h1>
      </div>

      {/* Message Display */}
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search by book name, author, Subject, or ISBN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="row g-4">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div className="col-lg-6 col-xl-4" key={book.id}>
              <div className="card h-100 shadow border-0">
                <div className="card-body d-flex flex-column p-4">
                  <h5 className="card-title">{book.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {book.author}
                  </h6>
                  <p className="card-text small mb-1">
                    <strong>ISBN:</strong> {book.isbn}
                  </p>
                  <p className="card-text small mb-1">
                    <strong>Price:</strong> {book.price}
                  </p>
                  <p className="card-text small mb-4">
                    <strong>Subject:</strong> {book.subject}
                  </p>

                  <div className="mt-auto">
                    <div className="d-flex justify-content-around text-center border-top border-bottom py-3 mb-3">
                      <div>
                        <span className="fw-bold d-block fs-5">
                          {book.copies}
                        </span>
                        <small className="text-muted">Total</small>
                      </div>
                      <div>
                        <span className="fw-bold d-block fs-5 text-warning">
                          {book.borrowed}
                        </span>
                        <small className="text-muted">Borrowed</small>
                      </div>
                      <div>
                        <span className="fw-bold d-block fs-5 text-success">
                          {book.available}
                        </span>
                        <small className="text-muted">Available</small>
                      </div>
                    </div>
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleAddCopy(book)}
                      >
                        Add Copy
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleUpdate(book)}
                      >
                        Update
                      </button>
                      {/* <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(book.id)}
                      >
                        Delete
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="text-center p-5 bg-light rounded">
              <p className="lead mb-0">No books found matching your search.</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal show"
          tabIndex="-1"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalType === "addCopy"
                    ? `Add Copy for: ${selectedBook.name}`
                    : `Update Book: ${selectedBook.name}`}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleModalClose}
                ></button>
              </div>
              <div className="modal-body">
                {modalType === "addCopy" ? (
                  <form onSubmit={handleAddCopySubmit}>
                    <div className="mb-3">
                      <label htmlFor="rackNumber" className="form-label">
                        Rack Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="rackNumber"
                        value={rackNumber}
                        onChange={(e) => setRackNumber(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Add Copy
                    </button>
                  </form>
                ) : (
                  // Update Book
                  <form onSubmit={handleUpdateSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Book Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Author</label>
                      <input
                        type="text"
                        className="form-control"
                        name="author"
                        value={editForm.author}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">ISBN</label>
                      <input
                        type="text"
                        className="form-control"
                        name="isbn"
                        value={editForm.isbn}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Price</label>
                      <input
                        type="text"
                        className="form-control"
                        name="price"
                        value={editForm.price}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Subject</label>
                      <input
                        type="text"
                        className="form-control"
                        name="subject"
                        value={editForm.subject}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBook;
