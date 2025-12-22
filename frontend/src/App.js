import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Plane, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FlightDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [flights, setFlights] = useState([]);
  const [showJiffyJane, setShowJiffyJane] = useState(false);
  const [jiffyJaneMessage, setJiffyJaneMessage] = useState("");
  const [showClaimDetails, setShowClaimDetails] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);

  // Initial flight data with SQ656 having paid claim
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
      claimAmount: "$100"
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
      claimAmount: "$100"
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
      claimNumber: "-",
      claimStatus: "-",
      claimAmount: "-"
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
      claimAmount: "$150"
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
      claimNumber: "-",
      claimStatus: "-",
      claimAmount: "-"
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
      claimNumber: "-",
      claimStatus: "-",
      claimAmount: "-"
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
      claimNumber: "-",
      claimStatus: "-",
      claimAmount: "-"
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
      claimNumber: "-",
      claimStatus: "-",
      claimAmount: "-"
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
      claimNumber: "-",
      claimStatus: "-",
      claimAmount: "-"
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
      claimNumber: "-",
      claimStatus: "-",
      claimAmount: "-"
    }
  ];

  // Initialize flights on mount
  useEffect(() => {
    setFlights(initialFlights);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Add cancelled SQ656 row after 20 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      const cancelledSQ656 = {
        id: Date.now(),
        policyNumber: "TRV-2026-001487",
        traveller: "Jolene Chua",
        flightNumber: "SQ656",
        route: "SIN → HAK",
        status: "Cancelled",
        expectedTime: "10:01",
        actualTime: "N/A",
        claimNumber: "CLM-TRV-2026-008431-1",
        claimStatus: "Paid",
        claimAmount: "$150",
        isNew: true
      };

      // Add new cancelled row at the top
      setFlights(prevFlights => [cancelledSQ656, ...prevFlights]);

      // Show Jiffy Jane message
      setJiffyJaneMessage(
        `A new claim of $150 has successfully been paid.`
      );
      setShowJiffyJane(true);
    }, 20000); // 20 seconds

    return () => clearTimeout(timer);
  }, []);

  // Format time for Singapore timezone
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-SG', {
      timeZone: 'Asia/Singapore',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  // Format date for Singapore timezone
  const formatDate = (date) => {
    return date.toLocaleDateString('en-SG', {
      timeZone: 'Asia/Singapore',
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get badge color based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case "Delayed":
        return <Badge className="shadow bg-[#FFFFE0] text-black hover:bg-[#FFFACD] border-[#FFFFE0]" data-testid={`status-badge-delayed`}>{status}</Badge>;
      case "On Time":
        return <Badge className="shadow bg-[#DFF0D8] text-[#00008B] hover:bg-[#D4E9CC] border-[#DFF0D8]" data-testid={`status-badge-ontime`}>{status}</Badge>;
      case "Cancelled":
        return <Badge className="shadow bg-[#FFE5E5] text-black hover:bg-[#FFD9D9] border-[#FFE5E5]" data-testid={`status-badge-cancelled`}>{status}</Badge>;
      default:
        return <Badge data-testid={`status-badge-default`}>{status}</Badge>;
    }
  };

  // Handle claim number click
  const handleClaimClick = (flight) => {
    setSelectedClaim(flight);
    setShowClaimDetails(true);
  };

  return (
    <div className="min-h-screen bg-gray-100" data-testid="flight-dashboard">
      {/* Header */}
      <header className="bg-orange-500 text-white py-4 px-8 shadow-lg" data-testid="dashboard-header">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          {/* Income Logo */}
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4C11.163 4 4 11.163 4 20C4 28.837 11.163 36 20 36C28.837 36 36 28.837 36 20C36 11.163 28.837 4 20 4ZM20 8C26.627 8 32 13.373 32 20C32 26.627 26.627 32 20 32C13.373 32 8 26.627 8 20C8 13.373 13.373 8 20 8Z" fill="white"/>
              <path d="M20 12C15.582 12 12 15.582 12 20C12 24.418 15.582 28 20 28V12Z" fill="white"/>
            </svg>
            <span className="text-2xl font-bold">income</span>
          </div>
          <div className="border-l border-white/30 pl-6 flex items-center gap-3">
            <Plane className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold" data-testid="dashboard-title">Claim Command Center</h1>
              <p className="text-orange-100 text-sm" data-testid="dashboard-subtitle">Real-time triggers for travel insurance claims</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Flight Information Board */}
        <div className="bg-slate-800 text-white rounded-lg shadow-xl p-6 mb-6" data-testid="flight-info-board">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1" data-testid="board-title">Flight Information Board</h2>
              <p className="text-slate-300 text-sm" data-testid="board-subtitle">Real-time flight status and departure times</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4 text-left" data-testid="timezone-card">
              <div className="flex items-center gap-2 text-slate-400 mb-1" data-testid="timezone-label">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Singapore Time (SGT)</span>
              </div>
              <div className="text-sm text-slate-400 mb-1" data-testid="current-date">{formatDate(currentTime)}</div>
              <div className="text-3xl font-bold text-white" data-testid="current-time">{formatTime(currentTime)}</div>
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
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${flight.isNew ? 'bg-orange-100' : ''}`}
                    data-testid={`flight-row-${index}`}
                  >
                    <td className="px-4 py-4 text-sm font-bold text-orange-600" data-testid={`policy-${index}`}>{flight.policyNumber}</td>
                    <td className="px-4 py-4 text-sm text-black" data-testid={`traveller-${index}`}>{flight.traveller}</td>
                    <td className="px-4 py-4 text-sm font-bold text-black" data-testid={`flight-${index}`}>{flight.flightNumber}</td>
                    <td className="px-4 py-4 text-sm text-black" data-testid={`route-${index}`}>{flight.route}</td>
                    <td className="px-4 py-4 text-sm" data-testid={`status-${index}`}>{getStatusBadge(flight.status)}</td>
                    <td className="px-4 py-4 text-sm text-black" data-testid={`expected-${index}`}>{flight.expectedTime}</td>
                    <td className="px-4 py-4 text-sm text-black" data-testid={`actual-${index}`}>{flight.actualTime}</td>
                    <td className="px-4 py-4 text-sm" data-testid={`claim-number-${index}`}>
                      {flight.claimNumber !== "-" ? (
                        <button 
                          onClick={() => handleClaimClick(flight)}
                          className="text-blue-600 font-bold hover:text-blue-800 hover:underline cursor-pointer"
                          data-testid={`claim-number-btn-${index}`}
                        >
                          {flight.claimNumber}
                        </button>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm" data-testid={`claim-status-${index}`}>
                      {flight.claimStatus !== "-" ? (
                        <Badge className="bg-[#1E88E5] text-black font-bold hover:bg-[#1976D2]">{flight.claimStatus}</Badge>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm" data-testid={`claim-amount-${index}`}>
                      {flight.claimAmount !== "-" ? (
                        <span className="text-[#16A34A] font-bold">{flight.claimAmount}</span>
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
          <a href="https://app.emergent.sh" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Made with Emergent
          </a>
        </div>
      </main>

      {/* Jiffy Jane Message - Center of Screen */}
      {showJiffyJane && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="jiffy-jane-overlay">
          <div 
            className="bg-white rounded-lg shadow-2xl p-5 max-w-sm border border-gray-200"
            data-testid="jiffy-jane-dialog"
          >
            <button
              onClick={() => setShowJiffyJane(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
              data-testid="jiffy-jane-close-button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex gap-4 items-start">
              {/* Jiffy Jane Logo */}
              <div className="flex-shrink-0">
                <img 
                  src="https://customer-assets.emergentagent.com/job_cancel-notify-dash/artifacts/uqdtwa8d_image.png" 
                  alt="Jiffy Jane"
                  className="w-14 h-14 rounded-lg object-cover"
                />
              </div>
              {/* Message Content */}
              <div className="flex-1 pt-1">
                <h3 className="text-base font-bold text-gray-900 mb-2" data-testid="jiffy-jane-title">
                  Jiffy Jane
                </h3>
                <p className="text-sm text-gray-800 leading-relaxed" data-testid="jiffy-jane-message">
                  {jiffyJaneMessage}
                </p>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end border-t border-gray-100 pt-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="inline-block w-4 h-4 bg-slate-900 rounded flex items-center justify-center text-white text-[10px]">e</span>
                <span>Made with Emergent</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Claim Details Modal */}
      {showClaimDetails && selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="claim-details-overlay">
          <div 
            className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 relative"
            data-testid="claim-details-modal"
          >
            <button
              onClick={() => setShowClaimDetails(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              data-testid="claim-details-close-button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-6" data-testid="claim-details-title">
              Claim Details
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Claim Number</p>
                <p className="text-lg font-bold text-gray-900" data-testid="claim-details-number">{selectedClaim.claimNumber}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Flight Number</p>
                <p className="text-lg font-bold text-gray-900" data-testid="claim-details-flight">{selectedClaim.flightNumber}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <Badge className="bg-[#1E88E5] text-white font-bold" data-testid="claim-details-status">{selectedClaim.claimStatus}</Badge>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Paid Amount</p>
                <p className="text-2xl font-bold text-[#16A34A]" data-testid="claim-details-amount">{selectedClaim.claimAmount}</p>
              </div>
            </div>

            {/* Jiffy Jane Confirmation Message */}
            <div className="mt-6 bg-green-50 rounded-lg p-4">
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0">
                  <img 
                    src="https://customer-assets.emergentagent.com/job_cancel-notify-dash/artifacts/uqdtwa8d_image.png" 
                    alt="Jiffy Jane"
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900 mb-1">Jiffy Jane</h4>
                  <p className="text-sm text-gray-700" data-testid="claim-details-message">
                    A new claim of {selectedClaim.claimAmount} has successfully been paid.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
