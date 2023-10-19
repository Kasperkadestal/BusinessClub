<script lang="ts">
    import {
      Table,
      tableMapperValues,
      type TableSource,
    } from "@skeletonlabs/skeleton";
  
    const sourceData = [
    {
      position: 1,
      name: "Boka möte",
      date: "2023-02-11",
      participants: "Roger Johansson",
      time: "12:00",
    },
    {
      position: 2,
      name: "Boka möte",
      date: "2023-03-11",
      participants: "Roger Johansson",
      time: "12:00",
    },
    {
      position: 3,
      name: "Boka möte",
      date: "2023-04-11",
      participants: "Roger Johansson",
      time: "12:00",
    },
    {
      position: 4,
      name: "Boka möte",
      date: "2023-05-11",
      participants: "Roger Johansson",
      time: "12:00",
    },
  ];
  
  const tableSimple: TableSource = {
    // A list of heading labels.
    head: ["Meddelanden", "", "", ""],
    // The data visibly shown in your table body UI.
    body: tableMapperValues(sourceData, [
      "name",
      "date",
      "participants",
      "time",
    ]),
    // Optional: The data returned when interactive is enabled and a row is clicked.
    meta: tableMapperValues(sourceData, ["position", "name"]),
  };
  </script>
  
  <Table source={tableSimple} />
  