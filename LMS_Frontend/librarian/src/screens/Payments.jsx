import { useEffect, useState } from "react";
import apiClient from "../api/ApiClient";

const Payments = () => {
  // Mock data based on the provided image
  // const mockPayments = [
  //   {
  //     id: 18,
  //     member_name: "Aditi Sharma",
  //     amount: 750.0,
  //     type: "Annual Membership",
  //     txtime: "2025-09-19 19:49:49",
  //     status: "done",
  //   },
  //   {
  //     id: 19,
  //     member_name: "Rohan Mehta",
  //     amount: 50.0,
  //     type: "Fine",
  //     txtime: "2025-09-19 19:49:49",
  //     status: "pending",
  //   },
  //   {
  //     id: 20,
  //     member_name: "Sonia Gandhi",
  //     amount: 100.0,
  //     type: "Book Borrowed",
  //     txtime: "2025-09-19 19:49:49",
  //     status: "done",
  //   },
  //   {
  //     id: 21,
  //     member_name: "Vikram Patel",
  //     amount: 20.0,
  //     type: "Book Extension",
  //     txtime: "2025-09-19 19:49:49",
  //     status: "done",
  //   },
  //   {
  //     id: 22,
  //     member_name: "Rohan Mehta",
  //     amount: 750.0,
  //     type: "Annual Membership",
  //     txtime: "2025-09-20 10:00:00",
  //     status: "done",
  //   },
  //   {
  //     id: 23,
  //     member_name: "Sonia Gupta",
  //     amount: 200.0,
  //     type: "Fine",
  //     txtime: "2025-09-21 12:30:00",
  //     status: "failed",
  //   },
  //   {
  //     id: 24,
  //     member_name: "Aditi Sharma",
  //     amount: 120.0,
  //     type: "Book Borrowed",
  //     txtime: "2025-09-22 15:00:00",
  //     status: "pending",
  //   },
  //   {
  //     id: 25,
  //     member_name: "Aditi Sharma",
  //     amount: 30.0,
  //     type: "Book Extension",
  //     txtime: "2025-09-23 18:00:00",
  //     status: "done",
  //   },
  // ];

  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState(payments);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const paymentTypes = [...new Set(payments.map((p) => p.type))];
  const paymentStatuses = [...new Set(payments.map((p) => p.status))];

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    let result = payments;
    // Filter by search query (member name)
    if (searchQuery) {
      result = result.filter((p) =>
        p.member_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      result = result.filter((p) => {
        const paymentDate = new Date(p.txtime);
        return paymentDate >= start && paymentDate <= end;
      });
    }

    // Filter by type
    if (selectedType !== "all") {
      result = result.filter((p) => p.type === selectedType);
    }

    // Filter by status
    if (selectedStatus !== "all") {
      result = result.filter((p) => p.status === selectedStatus);
    }

    setFilteredPayments(result);
  }, [searchQuery, startDate, endDate, selectedType, selectedStatus, payments]);

  const fetchPayments = async () => {
    const response = await apiClient.get("/getAllPayments");
    console.log(response.data.data);
    setPayments(response.data.data);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "done":
        return "badge bg-success";
      case "pending":
        return "badge bg-warning text-dark";
      case "failed":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  return (
    <div>
      <h1 className="mb-4">Payments</h1>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="card-title">Filters</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Search by Member</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter member name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Date Range</label>
              <div className="input-group">
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <label className="form-label">Type</label>
              <select
                className="form-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">All</option>
                {paymentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All</option>
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  {/* <th>ID</th> */}
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((p) => (
                    <tr key={p.id}>
                      {/* <td>{p.id}</td> */}
                      <td>{p.member_name}</td>
                      <td>₹{p.amount}</td>
                      <td>{p.type}</td>
                      <td>{new Date(p.txtime).toLocaleString()}</td>
                      <td>
                        <span className={getStatusBadge(p.status)}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No payments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
