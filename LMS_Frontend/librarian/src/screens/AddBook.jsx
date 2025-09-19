import { useEffect, useState } from "react";
import apiClient from "../api/ApiClient";

const AddBook = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [isbn, setIsbn] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubject();
  }, []);

  const fetchSubject = async () => {
    try {
      const response = await apiClient.get("/getSubjects");
      setSubjects(response.data.data);
      //   console.log(response.data.data);
    } catch (err) {
      setError("Error fetching subjects");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("name: ", name);
    // console.log("price: ", price);
    // console.log("isbn: ", isbn);
    // console.log("author: ", author);
    // console.log("subject: ", subject);

    if (!name) {
      setError("Please Enter Name");
    } else if (!author) {
      setError("Please Enter Author");
    } else if (!isbn) {
      setError("Please Enter ISBN");
    } else if (!price) {
      setError("Please Enter Price");
    } else if (!subject) {
      setError("Please Enter Subject");
    }

    try {
      const response = await apiClient.post("/addBook", {
        name,
        author,
        subject,
        price,
        isbn,
      });

      if (response.data.status === "success") {
        alert("new Book Added");

        setName("");
        setAuthor("");
        setIsbn("");
        setPrice("");
        setSubject("");
      }
    } catch (err) {
      setError("Something unexpected happens!..");
    }
  };

  return (
    <div>
      <h1 className="mb-4">Add Book</h1>

      {/* Error Message Display */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="card-title mb-3">New Book Details</h5>
          <form onSubmit={handleSubmit}>
            {/* Book Name */}
            <div className="mb-3">
              <label htmlFor="bookName" className="form-label">
                Book Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="form-control"
                id="name"
                placeholder="e.g., The Lord of the Rings"
              />
            </div>
            {/* Book Author */}
            <div className="mb-3">
              <label htmlFor="author" className="form-label">
                Author
              </label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                type="text"
                className="form-control"
                id="author"
                placeholder="e.g., J.R.R. Tolkien"
              />
            </div>
            {/* Book Subject */}
            <div className="mb-3">
              <label htmlFor="subject" className="form-label">
                Subject
              </label>
              <input
                className="form-control"
                list="subjects-datalist"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Type or select a subject"
                required
              />
              <datalist id="subjects-datalist">
                {subjects.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
            {/* Book Price */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  className="form-control"
                  id="price"
                  placeholder="e.g., 29.99"
                />
              </div>
              {/* Book ISBN Number */}
              <div className="col-md-6 mb-3">
                <label htmlFor="isbn" className="form-label">
                  ISBN Number
                </label>
                <input
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  type="text"
                  className="form-control"
                  id="isbn"
                  placeholder="e.g., 978-0618640157"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Add Book
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
