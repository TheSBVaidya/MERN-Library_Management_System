import { useEffect, useState } from "react";
import { UsersIcon, BookIcon } from "./IconComponents";
import apiClient from "../api/ApiClient";

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
  const [data, setData] = useState("");

  const fetchData = async () => {
    try {
      const response = await apiClient.get("/dashboard");
      // console.log(response.data.data);
      // console.log(response.data.data.librarian_count);
      // console.log(response.data.data.user_count);
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = [
    {
      title: "Total Librarians",
      value: data.librarian_count,
      icon: <UsersIcon className="text-white" />,
      bgColor: "bg-primary",
    },
    {
      title: "Total Members",
      value: data.user_count,
      icon: <UsersIcon className="text-white" />,
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
      <div className="mt-5">
        <h2 className="h3 mb-3">Recent Activity</h2>
        <div className="card shadow-sm">
          <div className="card-body">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                Librarian 'John Doe' returned 'The Midnight Library'.
              </li>
              <li className="list-group-item">
                New member 'Alice Smith' registered.
              </li>
              <li className="list-group-item">
                Librarian 'Jane Foster' added 5 new copies of 'Dune'.
              </li>
              <li className="list-group-item">
                New Librarian 'Peter Quill' was registered.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
