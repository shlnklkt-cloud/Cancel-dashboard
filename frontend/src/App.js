import { useState, useEffect, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Clock, Plane } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Initial flight data
const initialFlights = [
  {
    id: 1,
    policyNumber: "TRV-2026-001487",
    traveller: "Jolene Chua",
    flightNumber: "SQ656",
    route: "SIN → HAK",
    status: "Delayed",
    expectedTime: "10:01",
    actualTime: "16:01",
    claimNumber: "CLM-TRV-2026-008431",
    claimStatus: "Paid",
    claimAmount: 100
  },
  {
    id: 2,
    policyNumber: "TRV-2026-004392",
    traveller: "Amirul Rahman",
    flightNumber: "BG498",
    route: "SIN → DAC",
    status: "Delayed",
    expectedTime: "09:01",
    actualTime: "15:01",
    claimNumber: "CLM-TRV-2026-008420",
    claimStatus: "Paid",
    claimAmount: 100
  },
  {
    id: 3,
    policyNumber: "TRV-2026-010234",
    traveller: "Siti Aishah",
    flightNumber: "PK312",
    route: "SIN → KHI",
    status: "On Time",
    expectedTime: "28:45",
    actualTime: "28:45",
    claimNumber: null,
    claimStatus: null,
    claimAmount: null
  },
  {
    id: 4,
    policyNumber: "TRV-2026-009001",
    traveller: "Darren Ong",
    flightNumber: "SQ308",
    route: "SIN → MLE",
    status: "Cancelled",
    expectedTime: "17:05",
    actualTime: "N/A",
    claimNumber: "CLM-TRV-2026-008424",
    claimStatus: "Paid",
    claimAmount: 150
  },
  {
    id: 5,
    policyNumber: "TRV-2026-012145",
    traveller: "Wei Ming Tan",
    flightNumber: "SQ878",
    route: "SIN → BKK",
    status: "On Time",
    expectedTime: "12:01",
    actualTime: "12:01",
    claimNumber: null,
    claimStatus: null,
    claimAmount: null
  },
  {
    id: 6,
    policyNumber: "TRV-2026-013567",
    traveller: "Maya Lim",
    flightNumber: "TR385",
    route: "SIN → TPE",
    status: "On Time",
    expectedTime: "13:31",
    actualTime: "13:31",
    claimNumber: null,
    claimStatus: null,
    claimAmount: null
  },
  {
    id: 7,
    policyNumber: "TRV-2026-014892",
    traveller: "Raj Kumar",
    flightNumber: "AI346",
    route: "SIN → DEL",
    status: "On Time",
    expectedTime: "11:31",
    actualTime: "11:31",
    claimNumber: null,
    claimStatus: null,
    claimAmount: null
  },
  {
    id: 8,
    policyNumber: "TRV-2026-015234",
    traveller: "Sarah Chen",
    flightNumber: "CX715",
    route: "SIN → HKG",
    status: "On Time",
    expectedTime: "14:01",
    actualTime: "14:01",
    claimNumber: null,
    claimStatus: null,
    claimAmount: null
  },
  {
    id: 9,
    policyNumber: "TRV-2026-016789",
    traveller: "Ahmad Yusof",
    flightNumber: "QR944",
    route: "SIN → DOH",
    status: "On Time",
    expectedTime: "15:01",
    actualTime: "15:01",
    claimNumber: null,
    claimStatus: null,
    claimAmount: null
  },
  {
    id: 10,
    policyNumber: "TRV-2026-017456",
    traveller: "Jessica Wong",
    flightNumber: "EK354",
    route: "SIN → DXB",
    status: "On Time",
    expectedTime: "16:31",
    actualTime: "16:31",
    claimNumber: null,
    claimStatus: null,
    claimAmount: null
  }
];

// Predefined data for new rows
const newTravellers = [
  "John Tan", "Lisa Ng", "Michael Lee", "Emily Wong", "David Lim",
  "Sophie Koh", "James Goh", "Michelle Teo", "Kevin Chia", "Rachel Yeo",
  "Daniel Sim", "Amanda Phua", "Ryan Seah", "Natalie Tay", "Brandon Heng",
  "Cheryl Ong", "Marcus Foo", "Joanne Lau", "Timothy Chew", "Vanessa Ho"
];

const flightNumbers = [
  "SQ123", "SQ456", "SQ789", "TR101", "TR202", "3K505", "MI321", "SQ852",
  "CX888", "QF001", "EK432", "BA015", "JL060", "NH801", "KE623", "TG404"
];

const routes = [
  "SIN → NRT", "SIN → ICN", "SIN → PVG", "SIN → LHR", "SIN → CDG",
  "SIN → SYD", "SIN → MEL", "SIN → JFK", "SIN → LAX", "SIN → DXB",
  "SIN → HND", "SIN → PEK", "SIN → FCO", "SIN → AMS", "SIN → FRA"
];

const statuses = ["Delayed", "Cancelled", "On Time"];
const claimAmounts = [100, 150, 200, 250];

const getStatusBadge = (status) => {
  switch (status) {
    case "Delayed":
      return (
        <Badge 
          className="shadow bg-[#FFFFE0] text-black font-bold hover:bg-[#FFFACD] border-[#FFFFE0]"
          data-testid="status-badge-delayed"
        >
          Delayed
        </Badge>
      );
    case "On Time":
      return (
        <Badge 
          className="shadow bg-[#DFF0D8] text-[#00008B] font-bold hover:bg-[#D4E9CC] border-[#DFF0D8]"
          data-testid="status-badge-ontime"
        >
          On Time
        </Badge>
      );
    case "Cancelled":
      return (
        <Badge 
          className="shadow bg-[#FFE5E5] text-black font-bold hover:bg-[#FFD9D9] border-[#FFE5E5]"
          data-testid="status-badge-cancelled"
        >
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const FlightDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [flights, setFlights] = useState(initialFlights);
  const nextIdRef = useRef(11);
  const nextPolicyRef = useRef(18000);
  const nextClaimRef = useRef(8432);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-add new row every 20 seconds
  useEffect(() => {
    const addNewRow = () => {
      const randomTraveller = newTravellers[Math.floor(Math.random() * newTravellers.length)];
      const randomFlight = flightNumbers[Math.floor(Math.random() * flightNumbers.length)];
      const randomRoute = routes[Math.floor(Math.random() * routes.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Generate random times
      const hour = Math.floor(Math.random() * 24).toString().padStart(2, '0');
      const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
      const expectedTime = `${hour}:${minute}`;
      
      // For delayed flights, actual time is later
      let actualTime = expectedTime;
      if (randomStatus === "Delayed") {
        const delayHours = parseInt(hour) + Math.floor(Math.random() * 6) + 1;
        actualTime = `${(delayHours % 24).toString().padStart(2, '0')}:${minute}`;
      } else if (randomStatus === "Cancelled") {
        actualTime = "N/A";
      }

      // Generate claim info only for Delayed or Cancelled flights
      const hasClaim = randomStatus === "Delayed" || randomStatus === "Cancelled";
      const claimNumber = hasClaim ? `CLM-TRV-2026-00${nextClaimRef.current}` : null;
      const claimStatus = hasClaim ? "Paid" : null;
      const claimAmount = hasClaim ? claimAmounts[Math.floor(Math.random() * claimAmounts.length)] : null;

      if (hasClaim) {
        nextClaimRef.current++;
      }

      const newFlight = {
        id: nextIdRef.current,
        policyNumber: `TRV-2026-0${nextPolicyRef.current}`,
        traveller: randomTraveller,
        flightNumber: randomFlight,
        route: randomRoute,
        status: randomStatus,
        expectedTime: expectedTime,
        actualTime: actualTime,
        claimNumber: claimNumber,
        claimStatus: claimStatus,
        claimAmount: claimAmount
      };

      nextIdRef.current++;
      nextPolicyRef.current++;

      // Add new row at the top
      setFlights(prevFlights => [newFlight, ...prevFlights]);
    };

    const intervalId = setInterval(addNewRow, 20000); // 20 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Format time for Singapore timezone
  const formatSingaporeTime = (date) => {
    return date.toLocaleTimeString('en-SG', { 
      timeZone: 'Asia/Singapore',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Format date for Singapore timezone
  const formatSingaporeDate = (date) => {
    return date.toLocaleDateString('en-SG', { 
      timeZone: 'Asia/Singapore',
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100" data-testid="flight-dashboard">
      {/* Header */}
      <header className="bg-orange-500 text-white py-4 px-8" data-testid="dashboard-header">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Plane className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold" data-testid="header-title">Claim Command Center</h1>
            <p className="text-orange-100 text-sm" data-testid="header-subtitle">Real-time triggers for travel insurance claims</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Flight Information Board Header */}
        <div className="bg-slate-800 text-white rounded-lg shadow-xl p-6 mb-6" data-testid="flight-info-board">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1" data-testid="board-title">Flight Information Board</h2>
              <p className="text-slate-300 text-sm" data-testid="board-subtitle">Real-time flight status and departure times</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-slate-300 mb-1" data-testid="timezone-label">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Singapore Time (SGT)</span>
              </div>
              <div className="text-lg font-medium text-slate-300" data-testid="current-date">
                {formatSingaporeDate(currentTime)}
              </div>
              <div className="text-3xl font-mono font-bold" data-testid="current-time">
                {formatSingaporeTime(currentTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Flight Table */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden" data-testid="flight-table-container">
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="flight-table">
              <thead className="bg-slate-100 border-b-2 border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700" data-testid="header-policy">Policy Number</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700" data-testid="header-traveller">Travellers</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700" data-testid="header-flight">Flight Number</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700" data-testid="header-route">Route</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700" data-testid="header-status">Flight Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700" data-testid="header-expected">Expected Departure Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700" data-testid="header-actual">Actual Departure Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700" data-testid="header-claim-number">Claim Number</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700" data-testid="header-claim-status">Claim Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700" data-testid="header-claim-amount">Claim Paid Amount</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight, index) => (
                  <tr 
                    key={flight.id} 
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${index === 0 && flights.length > 10 ? 'bg-green-50 animate-pulse' : ''}`}
                    data-testid={`flight-row-${index}`}
                  >
                    <td className="px-4 py-4 text-sm font-medium text-orange-600" data-testid={`policy-${index}`}>{flight.policyNumber}</td>
                    <td className="px-4 py-4 text-sm font-bold text-black" data-testid={`traveller-${index}`}>{flight.traveller}</td>
                    <td className="px-4 py-4 text-sm font-bold text-black" data-testid={`flight-${index}`}>{flight.flightNumber}</td>
                    <td className="px-4 py-4 text-sm font-bold text-black" data-testid={`route-${index}`}>{flight.route}</td>
                    <td className="px-4 py-4 text-sm" data-testid={`status-${index}`}>
                      {getStatusBadge(flight.status)}
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-black" data-testid={`expected-${index}`}>{flight.expectedTime}</td>
                    <td className="px-4 py-4 text-sm font-bold text-black" data-testid={`actual-${index}`}>{flight.actualTime}</td>
                    <td className="px-4 py-4 text-sm" data-testid={`claim-number-${index}`}>
                      {flight.claimNumber ? (
                        <span className="text-black font-bold">{flight.claimNumber}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm" data-testid={`claim-status-${index}`}>
                      {flight.claimStatus ? (
                        <Badge className="bg-blue-500 text-white font-bold hover:bg-blue-600">
                          {flight.claimStatus}
                        </Badge>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm" data-testid={`claim-amount-${index}`}>
                      {flight.claimAmount ? (
                        <span className="text-black font-bold">${flight.claimAmount}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm flex items-center justify-center gap-2" data-testid="dashboard-footer">
          <span>⚡Made in Bolt</span>
          <span>|</span>
          <a href="https://app.emergent.sh/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Made with Emergent
          </a>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FlightDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
