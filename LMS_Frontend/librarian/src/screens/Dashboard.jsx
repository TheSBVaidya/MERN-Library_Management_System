import { useEffect, useState } from "react";
import apiClient from "../api/ApiClient";
import { BookIcon, MembersIcon, PaymentsIcon } from "../icons/iconComponent";

const StatCard = ({ title, value, icon, bgColor }) => {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body d-flex align-items-center">
        <div className={`p-3 rounded-3 me-3 ${bgColor}`}>{icon}</div>
        <div>
          <h6 className="card-subtitle mb-2 text-muted">{title}</h6>
          <h5 className="card-title fs-2 fw-bold">{value}</h5>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await apiClient.get("/dashboard");
      setData(response.data.data);
    } catch (err) {
      alert("Something Went Wrong...");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = [
    {
      title: "Total Books",
      value: data.total_books,
      icon: <BookIcon className="text-white" />,
      bgColor: "bg-primary",
    },
    {
      title: "Total Members",
      value: data.total_members,
      icon: <MembersIcon className="text-white" />,
      bgColor: "bg-success",
    },
    {
      title: "Total Fine Collected",
      value: `₹${data.total_fines}`,
      icon: <PaymentsIcon className="text-white" />,
      bgColor: "bg-info",
    },
    {
      title: "Total Amount",
      value: `₹${data.total_amount}`,
      icon: <PaymentsIcon className="text-white" />,
      bgColor: "bg-success",
    },
  ];

  const getName = localStorage.getItem("name");
  // console.log("Name from localStorage: " + getName);

  return (
    <>
      <h1 className="h2 mb-4">Welcome, {getName}</h1>
      <div className="row g-4">
        {stats.map((stat, index) => (
          <div className="col-md-6 col-lg-6" key={index}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
