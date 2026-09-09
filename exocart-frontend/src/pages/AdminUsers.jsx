import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  Users,
  User,
  Mail,
  Phone,
  Search,
  ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AdminUsers() {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  // ================= FETCH USERS =================

  const fetchUsers = async () => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {

        toast.error(
          "Please login as admin."
        );

        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:8080/api/users/all",
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (
        response.status === 401 ||
        response.status === 403
      ) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.error(
          "Session expired. Please login again."
        );

        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to fetch users"
        );
      }

      const data =
        await response.json();

      setUsers(data);

    } catch (error) {

      console.error(
        "Admin users error:",
        error
      );

      toast.error(
        "Failed to load users."
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= SEARCH =================

  const filteredUsers = useMemo(() => {

    const keyword =
      searchQuery.trim().toLowerCase();

    if (!keyword) {
      return users;
    }

    return users.filter((user) =>
      user.name
        ?.toLowerCase()
        .includes(keyword) ||

      user.email
        ?.toLowerCase()
        .includes(keyword) ||

      user.phoneNumber
        ?.toLowerCase()
        .includes(keyword) ||

      user.role
        ?.toLowerCase()
        .includes(keyword)
    );

  }, [users, searchQuery]);

  // ================= LOADING =================

  if (loading) {

    return (
      <div className="
        min-h-screen
        bg-[#020817]
        flex
        items-center
        justify-center
      ">

        <div className="text-center">

          <div className="
            w-10
            h-10
            border-4
            border-slate-700
            border-t-green-500
            rounded-full
            animate-spin
            mx-auto
            mb-4
          " />

          <p className="text-slate-400">
            Loading users...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="
      min-h-screen
      bg-[#020817]
    ">

      {/* ================= HEADER ================= */}

      <div className="
        border-b
        border-slate-800
      ">

        <div className="
          max-w-7xl
          mx-auto
          px-6
          py-7
        ">

          {/* BACK BUTTON */}

          <button
            type="button"
            onClick={() =>
              navigate("/admin")
            }
            className="
              flex
              items-center
              gap-2
              px-3
              py-2
              rounded-lg
              border
              border-slate-700
              text-slate-300
              text-sm
              hover:border-green-500
              hover:text-green-400
              transition
              cursor-pointer
              mb-5
            "
          >
            <ArrowLeft size={16} />
            Dashboard
          </button>

          <div className="
            flex
            items-center
            justify-between
            gap-6
          ">

            {/* TITLE */}

            <div>

              <h1 className="
                text-4xl
                font-bold
                text-white
              ">
                Users
              </h1>

              <p className="
                text-slate-400
                mt-2
              ">
                Manage registered customers
              </p>

            </div>

            {/* TOTAL USERS */}

            <div className="
              flex
              items-center
              gap-3
              bg-[#081225]
              border
              border-slate-800
              rounded-xl
              px-4
              py-3
            ">

              <div className="
                w-10
                h-10
                rounded-lg
                bg-green-500/10
                flex
                items-center
                justify-center
              ">

                <Users
                  size={20}
                  className="text-green-400"
                />

              </div>

              <div>

                <p className="
                  text-white
                  font-bold
                ">
                  {users.length}
                </p>

                <p className="
                  text-slate-500
                  text-xs
                ">
                  Total Users
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= CONTENT ================= */}

      <div className="
        max-w-7xl
        mx-auto
        px-6
        py-8
      ">

        {/* SEARCH */}

        <div className="
          relative
          max-w-md
          mb-6
        ">

          <Search
            size={18}
            className="
              absolute
              left-3
              top-3
              text-slate-500
            "
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            placeholder="
              Search by name, email, phone or role...
            "
            className="
              w-full
              bg-[#081225]
              border
              border-slate-700
              rounded-xl
              py-2.5
              pl-10
              pr-4
              text-sm
              text-white
              placeholder:text-slate-600
              outline-none
              focus:border-green-500
              transition
            "
          />

        </div>

        {/* USERS */}

        {filteredUsers.length === 0 ? (

          <div className="
            bg-[#081225]
            border
            border-slate-800
            rounded-2xl
            py-20
            text-center
          ">

            <Users
              size={42}
              className="
                text-slate-600
                mx-auto
                mb-4
              "
            />

            <h2 className="
              text-white
              text-lg
              font-semibold
            ">
              No users found
            </h2>

            <p className="
              text-slate-500
              text-sm
              mt-2
            ">
              Try a different search.
            </p>

          </div>

        ) : (

          <div className="
            bg-[#081225]
            border
            border-slate-800
            rounded-2xl
            overflow-hidden
          ">

            <div className="
              overflow-x-auto
            ">

              <table className="
                w-full
                text-sm
              ">

                {/* TABLE HEADER */}

                <thead>

                  <tr className="
                    border-b
                    border-slate-800
                    text-slate-500
                  ">

                    <th className="
                      text-left
                      px-6
                      py-4
                      font-medium
                    ">
                      User
                    </th>

                    <th className="
                      text-left
                      px-6
                      py-4
                      font-medium
                    ">
                      Email
                    </th>

                    <th className="
                      text-left
                      px-6
                      py-4
                      font-medium
                    ">
                      Phone
                    </th>

                    <th className="
                      text-left
                      px-6
                      py-4
                      font-medium
                    ">
                      Role
                    </th>

                    <th className="
                      text-left
                      px-6
                      py-4
                      font-medium
                    ">
                      User ID
                    </th>

                  </tr>

                </thead>

                {/* TABLE BODY */}

                <tbody>

                  {filteredUsers.map((user) => (

                    <tr
                      key={user.id}
                      className="
                        border-b
                        border-slate-800/70
                        last:border-0
                        hover:bg-slate-800/20
                        transition
                      "
                    >

                      {/* USER */}

                      <td className="
                        px-6
                        py-5
                      ">

                        <div className="
                          flex
                          items-center
                          gap-3
                        ">

                          <div className="
                            w-10
                            h-10
                            rounded-full
                            bg-green-500/10
                            border
                            border-green-500/20
                            flex
                            items-center
                            justify-center
                          ">

                            <User
                              size={19}
                              className="text-green-400"
                            />

                          </div>

                          <div>

                            <p className="
                              text-white
                              font-semibold
                            ">
                              {user.name}
                            </p>

                            <p className="
                              text-slate-500
                              text-xs
                              mt-0.5
                            ">
                              Registered customer
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* EMAIL */}

                      <td className="
                        px-6
                        py-5
                      ">

                        <div className="
                          flex
                          items-center
                          gap-2
                          text-slate-300
                        ">

                          <Mail
                            size={16}
                            className="text-blue-400"
                          />

                          {user.email}

                        </div>

                      </td>

                      {/* PHONE */}

                      <td className="
                        px-6
                        py-5
                      ">

                        <div className="
                          flex
                          items-center
                          gap-2
                          text-slate-300
                        ">

                          <Phone
                            size={16}
                            className="text-purple-400"
                          />

                          {user.phoneNumber ||
                            "Not provided"}

                        </div>

                      </td>

                      {/* ROLE */}

                      <td className="
                        px-6
                        py-5
                      ">

                        <span className={`
                          inline-flex
                          items-center
                          gap-1.5
                          px-3
                          py-1.5
                          rounded-lg
                          border
                          text-xs
                          font-semibold

                          ${
                            user.role === "ADMIN"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                              : "bg-green-500/10 text-green-400 border-green-500/20"
                          }
                        `}>

                          <ShieldCheck
                            size={14}
                          />

                          {user.role}

                        </span>

                      </td>

                      {/* ID */}

                      <td className="
                        px-6
                        py-5
                      ">

                        <span className="
                          text-slate-400
                          font-mono
                          text-xs
                        ">
                          #{user.id}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminUsers;