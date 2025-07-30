// src/components/Lesson2Table.jsx
import React from "react";
import { n5WordSets } from "../data/n5WordSets"; // ← 注意: 相対パス！

const lesson2Words = n5WordSets.Lesson2;

const Lesson2Table = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>Kanji</th>
          <th>Reading</th>
          <th>Indonesia</th>
          <th>English</th>
          <th>Chinese (Simplified)</th>
          <th>Chinese (Taiwan)</th>
        </tr>
      </thead>
      <tbody>
        {lesson2Words.map((w, index) => (
          <tr key={index}>
            <td>{w.kanji}</td>
            <td>{w.reading}</td>
            <td>{w.meanings.id}</td>
            <td>{w.meanings.en}</td>
            <td>{w.meanings.zh}</td>
            <td>{w.meanings.tw}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Lesson2Table;
