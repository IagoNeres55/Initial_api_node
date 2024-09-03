import http from "http";
import { v4 as uuid } from "uuid";
const port = 3000;

const grades = [];

const server = http.createServer((req, res) => {
  const { method, url } = req;
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const id = url.split("/")[2];

    if (url === "/grades" && method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(grades));
    } else if (url === "/grades" && method === "POST") {
      const { studentName, subject, grade } = JSON.parse(body);
      const newGrade = { id: uuid(), studentName, subject, grade };
      grades.push(newGrade);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newGrade));
    } else if (url.startsWith("/grades/") && method === "PUT") {
      const { studentName, subject, grade } = JSON.parse(body);
      const gradeToUpdate = grades.find((g) => g.id === id);

      if (gradeToUpdate) {
        gradeToUpdate.studentName = studentName;
        gradeToUpdate.subject = subject;
        gradeToUpdate.grade = grade;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(gradeToUpdate));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Grade not found" }));
      }
    } else if (url.startsWith("/grades/") && method === "DELETE") {
      const index = grades.findIndex((g) => g.id === id);
      if (index !== -1) {
        grades.splice(index, 1);
        res.writeHead(204);
        res.end(JSON.stringify({ message: "Grade deleted" }));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Grade not found" }));
      }
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Route not found" }));
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
