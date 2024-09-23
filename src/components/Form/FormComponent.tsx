import React, { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import "./FormComponent.css";

interface User {
  username: string;
  email: string;
}

interface FormValues {
  users: User[];
}

const FormComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange", //form validation in case of inputs changing
  });

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const data = await response.json();
      setUsers(
        data.map((user: any) => ({
          username: user.username,
          email: user.email,
        }))
      );
    };
    fetchData();
  }, []);

  const onSubmit: SubmitHandler<FormValues> = async (data): Promise<void> => {
    console.log("Submitted Data:", data);
    // Mock API submission
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        alert("Data submitted successfully!");
        resolve();
      }, 1000);
    });
  };

  const handleChange = (index: number, field: keyof User, value: string) => {
    const updatedUsers = [...users];
    updatedUsers[index][field] = value;
    setUsers(updatedUsers);
  };

  const addNewUser = () => {
    setUsers([{ username: "", email: "" }, ...users]);
  };

  const addAfter = (index: number) => {
    const newUsers: User[] = [...users];
    newUsers.splice(index + 1, 0, { username: "", email: "" });
    setUsers(newUsers);
    register(`users.${index + 1}.username`, { required: true });
    register(`users.${index + 1}.email`, {
      required: true,
      pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
    });
  };

  const deleteUser = (index: number) => {
    const newUsers = users.filter((elem, i) => i !== index);
    setUsers(newUsers);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={"form-container"}>
      <h1>
        Users{" "}
        <button type="button" className="add-new" onClick={addNewUser}>
          Add New
        </button>
      </h1>
      <div className="form-items">
        {users.map((user, index) => (
          <div key={index} className="form-row">
            <input
              {...register(`users.${index}.username`, { required: true })}
              value={user.username}
              onChange={(e) => handleChange(index, "username", e.target.value)}
              placeholder="user.username"
              className={errors.users?.[index]?.username ? "error" : ""}
            />
            {errors.users?.[index]?.username && (
              <span className="error-text">Username is required</span>
            )}

            <input
              {...register(`users.${index}.email`, {
                required: true,
                pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
              })}
              value={user.email}
              onChange={(e) => handleChange(index, "email", e.target.value)}
              placeholder="user.email"
              className={errors.users?.[index]?.email ? "error" : ""}
            />
            {errors.users?.[index]?.email && (
              <span className="error-text">Valid email is required</span>
            )}

            <button
              type="button"
              className="add-after"
              onClick={() => addAfter(index)}
            >
              Add after
            </button>
            <button
              type="button"
              className="delete"
              onClick={() => deleteUser(index)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <button type="submit" className="save-changes" disabled={!isValid}>
        Save Changes
      </button>
    </form>
  );
};

export default FormComponent;
