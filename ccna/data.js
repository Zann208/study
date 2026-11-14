/* CCNA console content: official 200-301 v2.0 exam topics, lab plan and case studies.
   Source of exam topics: Cisco Learning Network, "200-301 CCNA v2.0 Exam Topics" (first test date 3 Feb 2027).
   Edit labs and cases here; personal progress (objective status, lab status, exam date, practice scores)
   is saved in the browser by ccna.js. */
window.CCNA_DATA = {
  exam: { code: '200-301', version: '2.0', minutes: 120, firstTest: '2027-02-03' },

  domains: [
    { id: 'd1', no: '1.0', title: 'Network Infrastructure and Connectivity', weight: 25, objectives: [
      { id: '1.1', v11: 'partly', add: 'Distance limits, signal levels, pinouts', text: 'Diagnose interface and cable (copper and fiber) issues such as collisions, errors, mismatched duplex, speed, distance, interface, signal levels, pin out, and cable types' },
      { id: '1.2', v11: 'full', add: 'Hypervisor types', text: 'Describe the role and function of hypervisors, virtual machines, and containers' },
      { id: '1.3', v11: 'partly', add: 'Same concepts; practise fault-finding', text: 'Troubleshoot IPv4 address configuration, assignment, and subnetting (public and private)' },
      { id: '1.4', v11: 'partly', add: 'Assignment methods and prefix sizing', text: 'Troubleshoot IPv6 address configuration, assignment, and prefix sizing (unicast and modified EUI 64)' },
      { id: '1.5', v11: 'partly', add: 'Band and channel selection, interference', text: 'Describe wireless principles', subs: ['Band and channel selection', 'RF characteristics', 'Security protocols', 'Cause of interference'] },
      { id: '1.6', v11: 'partly', add: 'Reachability tests and wireless security settings on three OSes', text: 'Troubleshoot wired and wireless client connectivity (IP configuration, network reachability, and wireless security parameters on Windows, MacOS, and Linux)' },
      { id: '1.7', v11: 'partly', add: 'IOS DHCP server and its faults', text: 'Troubleshoot DHCPv4 client, server, and relay on IOS devices' }
    ] },
    { id: 'd2', no: '2.0', title: 'Switching and Network Access', weight: 25, objectives: [
      { id: '2.1', v11: 'full', add: '', text: 'Configure network infrastructure connectivity (switch-to-switch and switch-to-router)', subs: ['Layer 2/Layer 3 physical interfaces', 'Layer 2 802.1Q trunk interfaces', 'Layer 2/Layer 3 LACP port-channel/EtherChannel', 'Switch virtual interface (SVI)'] },
      { id: '2.2', v11: 'partly', add: 'PoE and edge-port profiles', text: 'Configure Layer 2 switch port attributes for edge-host connectivity (VLAN, PoE, port channel, and LACP)', subs: ['Desktop, printer, and IOT appliances', 'Wireless access points (standalone and controller based)', 'Voice over IP phone', 'Virtualized hosts', 'Network appliances'] },
      { id: '2.3', v11: 'full', add: 'Compare neighbour output with diagrams', text: 'Validate the accuracy of network documentation using CDP and LLDP' },
      { id: '2.4', v11: 'partly', add: 'Packet captures, extended ping, show logging', text: 'Troubleshoot basic Layer 2/Layer 3 connectivity and device operations using show commands (including show logs), ping, extended ping, trace route, and packet capture output' },
      { id: '2.5', v11: 'partly', add: 'Configuration commands, not only interpretation', text: 'Configure operations of the Rapid Per VLAN Spanning Tree Protocol (Rapid PVST+)', subs: ['Root port, root bridge (primary/secondary), and other port names', 'Port states and roles', 'PortFast', 'Root guard, loop guard, and BPDU guard'] }
    ] },
    { id: 'd3', no: '3.0', title: 'IP Routing', weight: 20, objectives: [
      { id: '3.1', v11: 'full', add: '', text: 'Interpret a routing table to identify the next hop for a packet (routing protocol, prefix/mask, administrative distance, metric, and default route)' },
      { id: '3.2', v11: 'partly', add: 'Same concepts; practise fault-finding', text: 'Troubleshoot IPv4 and IPv6 static routing', subs: ['Default route', 'Network route', 'Host route', 'Floating static'] },
      { id: '3.3', v11: 'partly', add: 'OSPFv3 is new', text: 'Configure single area OSPFv2 for IPv4 and OSPFv3 for IPv6', subs: ['Neighbor adjacencies (excluding authentication)', 'Point-to-point', 'Broadcast (DR/BDR selection)', 'Router ID'] },
      { id: '3.4', v11: 'partly', add: 'show standby and show vrrp output; VRRP', text: 'Interpret the operational status of First Hop Redundancy Protocols (HSRP and VRRP)' }
    ] },
    { id: 'd4', no: '4.0', title: 'Network Services and Security', weight: 20, objectives: [
      { id: '4.1', v11: 'partly', add: 'aaa new-model, server definitions, method lists', text: 'Configure network devices with local usernames and as an AAA client (TACACS+ and RADIUS) for management' },
      { id: '4.2', v11: 'new', add: 'SFTP and SCP replace TFTP/FTP', text: 'Manage device configuration and software files using secure file transfer operations with SFTP/SCP' },
      { id: '4.3', v11: 'full', add: 'PAT is now explicit', text: 'Configure NAT/PAT on IOS XE routers' },
      { id: '4.4', v11: 'new', add: 'Record types; nslookup and dig output', text: 'Diagnose issues with DNS records (A, AAAA, CNAME, MX, NS, and PTR) to support host, web application, and mail server access by name' },
      { id: '4.5', v11: 'full', add: '', text: 'Describe IPsec remote access and site-to-site VPNs (protocols and transport modes)' },
      { id: '4.6', v11: 'full', add: '', text: 'Configure IPv4 access control lists (standard, extended, numbered, and named ACLs)' },
      { id: '4.7', v11: 'partly', add: 'Storm control and RA guard are new', text: 'Configure Layer 2 security features', subs: ['DHCP snooping', 'Dynamic ARP inspection', 'Storm control', 'RA guard', 'Port security'] }
    ] },
    { id: 'd5', no: '5.0', title: 'AI, and Network Operations and Management', weight: 10, objectives: [
      { id: '5.1', v11: 'new', add: 'Agentic AI', text: 'Describe the role of agentic AI in network operations' },
      { id: '5.2', v11: 'new', add: 'Prompt components', text: 'Select a prompt to send to a generative AI system to support network operations considering prompt components such as data classification, output format, persona, and instructions' },
      { id: '5.3', v11: 'partly', add: 'Infrastructure as code; the five approaches', text: 'Describe network management approaches (device-based, cloud-based, controller-based, automation-based, and infrastructure as code)' },
      { id: '5.4', v11: 'full', add: '', text: 'Describe the function of SNMP in network operations' },
      { id: '5.5', v11: 'partly', add: 'Hands-on inventory, ad hoc commands, simple playbooks', text: 'Use configuration management mechanisms such as Ansible to execute commands' },
      { id: '5.6', v11: 'full', add: 'Practise parsing messages', text: 'Interpret syslog message content, severity levels, and facilities' }
    ] }
  ],

  /* Lab plan: one lab per objective cluster. status: planned | active | done (default shown; changes are saved in the browser). */
  labs: [
    { id: 'L-01', title: 'Interface and cable fault diagnosis', domain: '1.0', tool: 'Packet Tracer', obj: ['1.1'] },
    { id: 'L-02', title: 'IPv4 addressing plan and subnetting', domain: '1.0', tool: 'Packet Tracer', obj: ['1.3'] },
    { id: 'L-03', title: 'IPv6 addressing and modified EUI-64', domain: '1.0', tool: 'Packet Tracer', obj: ['1.4'] },
    { id: 'L-04', title: 'DHCPv4 server and relay', domain: '1.0', tool: 'Packet Tracer', obj: ['1.7'] },
    { id: 'L-05', title: 'VLANs, 802.1Q trunks and SVIs', domain: '2.0', tool: 'Packet Tracer', obj: ['2.1', '2.2'] },
    { id: 'L-06', title: 'LACP EtherChannel', domain: '2.0', tool: 'Packet Tracer', obj: ['2.1'] },
    { id: 'L-07', title: 'Rapid PVST+ root bridge and guards', domain: '2.0', tool: 'Packet Tracer', obj: ['2.5'] },
    { id: 'L-08', title: 'CDP and LLDP documentation check', domain: '2.0', tool: 'Packet Tracer', obj: ['2.3', '2.4'] },
    { id: 'L-09', title: 'Static routing and floating static', domain: '3.0', tool: 'Packet Tracer', obj: ['3.1', '3.2'] },
    { id: 'L-10', title: 'Single-area OSPFv2 and OSPFv3', domain: '3.0', tool: 'Packet Tracer', obj: ['3.3'] },
    { id: 'L-11', title: 'HSRP operational status', domain: '3.0', tool: 'Packet Tracer', obj: ['3.4'] },
    { id: 'L-12', title: 'Local users, AAA and SCP transfer', domain: '4.0', tool: 'Packet Tracer', obj: ['4.1', '4.2'] },
    { id: 'L-13', title: 'NAT and PAT on IOS XE', domain: '4.0', tool: 'Packet Tracer', obj: ['4.3'] },
    { id: 'L-14', title: 'Standard and extended ACLs', domain: '4.0', tool: 'Packet Tracer', obj: ['4.6'] },
    { id: 'L-15', title: 'DHCP snooping, DAI and port security', domain: '4.0', tool: 'Packet Tracer', obj: ['4.7'] },
    { id: 'L-16', title: 'Syslog and SNMP monitoring', domain: '5.0', tool: 'Packet Tracer', obj: ['5.4', '5.6'] },
    { id: 'L-17', title: 'Ansible command execution', domain: '5.0', tool: 'Ansible', obj: ['5.5'] }
  ],

  /* Case studies: add { id: 'CS-01', title: '', summary: '', tags: [], href: '' } entries here once published. */
  cases: [],

  /* Research snapshot. Status: official (Cisco or Pearson VUE page), older (Cisco document that predates v2.0),
     third (non-Cisco source), unverified. Re-check after 3 Feb 2027. */
  checked: '2026-11-14',

  facts: [
    { title: 'Format and scoring', rows: [
      { k: 'Exam', v: 'Implementing and Administering Cisco Solutions (200-301 CCNA) v2.0. The exam code stays 200-301.', s: 'official', src: 'https://learningnetwork.cisco.com/s/ccna-v2-exam-topics' },
      { k: 'Duration', v: '120 minutes', s: 'official', src: 'https://learningnetwork.cisco.com/s/ccna-v2-exam-topics' },
      { k: 'Question types', v: 'Performance-based (lab) questions, multiple choice and drag-and-drop. An exam tutorial is available.', s: 'official', src: 'https://learningnetwork.cisco.com/s/ccna-v2-exam-topics' },
      { k: 'Lab questions', v: 'Hands-on tasks on real Cisco IOS, designed for 5 to 7 minutes each. Any method that reaches the required end state is accepted.', s: 'older', src: 'https://blogs.cisco.com/learning/new-performance-based-lab-exam-items-build-opportunities' },
      { k: 'Navigation', v: 'A question can be skipped, but there is no going back to an earlier question.', s: 'older', src: 'https://blogs.cisco.com/learning/new-performance-based-lab-exam-items-build-opportunities' },
      { k: 'AI output', v: 'Questions may ask you to evaluate output and recommendations from agentic AI and digital network assistants.', s: 'official', src: 'https://learningcontent.cisco.com/documents/marketing/exam-topics/200-301_CCNA_v2.0_Exam_Topics_PDF.pdf' },
      { k: 'Number of questions', v: 'Not published by Cisco.', s: 'official', src: 'https://learningnetwork.cisco.com/s/ccna-v2-exam-topics' },
      { k: 'Passing score', v: 'Not published and may change. The score report shows a score per section and the passing score for that sitting.', s: 'official', src: 'https://www.cisco.com/c/en/us/training-events/training-certifications/exams/policies.html' },
      { k: '"825 out of 1000"', v: 'Widely quoted, but it appears on no Cisco page.', s: 'unverified' },
      { k: 'Results', v: 'Pass or fail is typically available online within 48 hours.', s: 'official', src: 'https://learningnetwork.cisco.com/s/ccna-v2-exam-topics' }
    ] },
    { title: 'Price, booking and delivery', rows: [
      { k: 'Price', v: 'US$300 plus tax. Paid by card through Pearson VUE, by voucher, or with Cisco Learning Credits.', s: 'official', src: 'https://www.cisco.com/site/us/en/learn/training-certifications/exams/index.html' },
      { k: 'Local price', v: 'Checkout currency and whether Thai VAT is added are not confirmed.', s: 'unverified' },
      { k: 'Languages', v: 'English and Japanese', s: 'official', src: 'https://learningnetwork.cisco.com/s/ccna-v2-exam-topics' },
      { k: 'Delivery', v: 'Pearson VUE test centre or online (OnVUE). Thailand is not on the restricted list for online testing.', s: 'official', src: 'https://www.pearsonvue.com/us/en/cisco/onvue.html' },
      { k: 'Online requirements', v: 'Windows 10 or macOS 14 and later, one display, webcam, 6 Mbps down and 2 Mbps up, no VPN, alone in a clear room. Check-in opens 30 minutes before.', s: 'official', src: 'https://www.pearsonvue.com/us/en/cisco/onvue.html' },
      { k: 'Chiang Mai centres', v: 'A 2025 third-party list shows three Pearson VUE centres in Chiang Mai. Confirm in the Pearson VUE locator when booking.', s: 'third', src: 'https://www.itcert2005.com/pearsonvue_testcenter.htm' },
      { k: 'Booking', v: 'Cisco account, then the certification tracking system, then Pearson VUE. Exams can usually be scheduled up to six weeks ahead.', s: 'official', src: 'https://3p.cisco.com/site/us/en/learn/training-certifications/certifications/faq.html' },
      { k: 'ID at a test centre', v: 'Two signed IDs, one a government photo ID. The name must match the booking exactly.', s: 'official', src: 'https://www.cisco.com/c/en/us/training-events/training-certifications/exams/policies.html' },
      { k: 'ID online', v: 'One valid government photo ID. Expired, digital or copied IDs are refused.', s: 'official', src: 'https://www.pearsonvue.com/us/en/cisco/onvue.html' },
      { k: 'Rescheduling', v: 'At least 24 hours before a test-centre appointment; before the start time online.', s: 'older', src: 'https://pseudoco.cisco.com/c/dam/en_us/training-events/downloads/Candidate_rights_responsibility.pdf' }
    ] },
    { title: 'Retakes and validity', rows: [
      { k: 'After a fail', v: 'Wait 5 calendar days. Each retake is full price.', s: 'official', src: 'https://www.cisco.com/site/us/en/learn/training-certifications/exams/index.html' },
      { k: 'Validity', v: 'Three years from the date earned. No extensions.', s: 'official', src: 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/recertification/index.html' },
      { k: 'Recertification', v: 'Retake the exam, pass a higher-level exam, or earn 30 Continuing Education credits.', s: 'official', src: 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/recertification/index.html' },
      { k: 'Exam content', v: 'Sharing or using disclosed exam questions can bring a lifetime ban and loss of all certifications.', s: 'official', src: 'https://www.cisco.com/c/en/us/training-events/training-certifications/exams/policies.html' }
    ] }
  ],

  timeline: [
    { when: '23 Dec 2026', what: 'Official Cert Guide Volume 1, 3rd Edition: estimated release (pre-order now)' },
    { when: '31 Dec 2026', what: 'Cisco Press discount code NEWCERT ends' },
    { when: 'Jan 2027', what: 'certskills.com post on using v1.1 books for v2.0 (planned)' },
    { when: '2 Feb 2027', what: 'Last day to sit v1.1' },
    { when: '3 Feb 2027', what: 'v2.0 goes live. Re-check every resource status on this page.' },
    { when: 'Feb 2027', what: 'Official Cert Guide Volume 2, 3rd Edition (author\'s estimate)' },
    { when: '6 weeks before', what: 'Booking window opens for the chosen exam date' }
  ],

  changes: {
    added: ['OSPFv3', 'VRRP status', 'DHCPv4 server on IOS', 'AAA client (TACACS+ and RADIUS)', 'SFTP and SCP', 'DNS record types', 'Storm control', 'RA guard', 'Agentic AI', 'Prompt selection', 'Infrastructure as code', 'Ansible', 'Packet capture output', 'Client troubleshooting on Windows, macOS and Linux', 'PoE and edge-port profiles'],
    dropped: ['QoS', 'REST APIs and JSON', 'Wireless controller GUI', 'AP modes and wireless architectures', 'SDN overlay and underlay', 'Terraform', 'NTP configuration', 'TFTP and FTP', 'Two-tier, three-tier and spine-leaf design', 'Password policy theory', 'BPDU filter'],
    keep: ['SSH (4.1 and 4.2 depend on it)', 'MAC learning and ARP', 'TCP and UDP ports (ACLs, packet captures)', 'IPv6 address types', 'Longest-prefix match, administrative distance, metric'],
    check: 'A v2.0 guide is describing the right exam only if it shows five domains at 25/25/20/20/10 and includes agentic AI, Ansible, OSPFv3 and VRRP. Six domains means v1.1.'
  },

  /* v2: 'v2' built for v2.0 | 'pending' announced | 'v11' built for v1.1 | 'any' version-independent | 'unknown' */
  resources: [
    { cat: 'Official', name: 'v2.0 exam topics', by: 'Cisco', v2: 'v2', cost: 'Free', dom: 'all', note: 'The reference every other resource is checked against.', url: 'https://learningnetwork.cisco.com/s/ccna-v2-exam-topics' },
    { cat: 'Official', name: 'Official Cert Guide, 3rd Edition', by: 'Wendell Odom, Cisco Press', v2: 'pending', cost: 'US$69.99 list (Vol 1)', dom: 'all', note: 'Volume 1 estimated 23 Dec 2026; Volume 2 estimated Feb 2027. The eBook avoids shipping delays.', url: 'https://www.ciscopress.com/store/ccna-200-301-official-cert-guide-volume-1-9780136171584' },
    { cat: 'Official', name: 'Cisco U. CCNA training', by: 'Cisco', v2: 'v2', cost: 'Free early access (confirm it is still open)', dom: 'all', note: 'Updated training that supports both v1.1 and v2.0. A paid v2 learning path and practice bundle also exists; price not confirmed.', url: 'https://blogs.cisco.com/learning/the-skills-payload-whats-landing-at-cisco-live-us-2026' },
    { cat: 'Official', name: 'Networking Academy CCNAv8', by: 'Cisco NetAcad', v2: 'pending', cost: 'Through an academy', dom: 'all', note: 'Three courses aligned to v2.0, promised before the end of 2026. Release not confirmed.', url: 'https://www.netacad.com' },
    { cat: 'Official', name: 'Blueprint deep dive, config labs and drills', by: 'certskills.com (Cert Guide author)', v2: 'v2', cost: 'Free', dom: 'all', note: 'Objective-by-objective reading of v2.0 from the Official Cert Guide author.', url: 'https://www.certskills.com/ccna26-02/' },
    { cat: 'Official', name: 'Cisco AI learning hub', by: 'Cisco', v2: 'any', cost: 'Free', dom: ['5.0'], note: 'Intro AI and prompting tutorials. Not mapped to 5.1 or 5.2, but the closest official material.', url: 'https://www.cisco.com/site/us/en/learn/training-certifications/learn-ai.html' },

    { cat: 'Courses', name: 'Jeremy\'s IT Lab', by: 'YouTube course, labs, flashcards', v2: 'v11', cost: 'Free', dom: ['1.0', '2.0', '3.0', '4.0'], note: 'The free standard. Still covers most of domains 1 to 4; skip the dropped topics and add the new ones from other sources.', url: 'https://www.jeremysitlab.com/ccna-resources/' },
    { cat: 'Courses', name: 'CBT Nuggets CCNA', by: 'Keith Barker, Jeff Kish', v2: 'v2', cost: 'Subscription', dom: 'all', note: 'Updated for v2.0 in October 2026, with an AI and operations section. One month near the exam is the low-cost way to use it.', url: 'https://www.cbtnuggets.com/blog/ccna-2-0-what-s-new-and-how-to-prepare' },
    { cat: 'Courses', name: 'Pluralsight CCNA v2.0 path', by: 'Pluralsight', v2: 'pending', cost: 'Subscription', dom: 'all', note: 'Two of nine courses were live when checked.', url: 'https://www.pluralsight.com/paths/cisco-ccna-implementing-and-administering-cisco-solutions-200-301-ccna-v20' },
    { cat: 'Courses', name: 'INE CCNA learning path', by: 'Keith Bogart', v2: 'pending', cost: 'Subscription', dom: 'all', note: 'Update announced without a date. Includes troubleshooting labs.', url: 'https://ine.com/blog/ccna-v2-exam-changes' },
    { cat: 'Courses', name: 'Practical Networking', by: 'Ed Harmoush', v2: 'any', cost: 'Free', dom: ['1.0'], note: 'Subnetting explained well, with practice.', url: 'https://www.practicalnetworking.net/' },

    { cat: 'Practice exams', name: 'Boson ExSim-Max', by: 'Boson', v2: 'unknown', cost: 'US$99 per year', dom: 'all', note: 'The community benchmark, harder than the real exam. The page does not name the blueprint version: confirm v2.0 before buying, four to six weeks before the exam.', url: 'https://www.boson.com/exsim-max-for-cisco-200-301-ccna' },

    { cat: 'Labs', name: 'Cisco Packet Tracer 9', by: 'Cisco NetAcad', v2: 'any', cost: 'Free', dom: ['1.0', '2.0', '3.0', '4.0'], note: 'Main lab tool. Supports fewer commands than real IOS, so test each new v2.0 feature before relying on it.', url: 'https://www.netacad.com' },
    { cat: 'Labs', name: 'Cisco Modeling Labs Free', by: 'Cisco', v2: 'any', cost: 'Free, 5 nodes', dom: ['2.0', '3.0', '4.0', '5.0'], note: 'Reported to be the platform behind the exam\'s lab questions. Built for x86 processors: it does not run on an Apple silicon Mac, so it needs an Intel or AMD machine or a cloud host.', url: 'https://developer.cisco.com/docs/modeling-labs/cml-free/' },
    { cat: 'Labs', name: 'Ansible cisco.ios collection', by: 'Ansible documentation', v2: 'any', cost: 'Free', dom: ['5.0'], note: 'Primary reference for running commands against IOS devices (5.5).', url: 'https://docs.ansible.com/ansible/latest/collections/cisco/ios/' }
  ],

  avoid: [
    'Brain dump sites and "real exam question" banks. They are disclosed exam content; Cisco can ban for life and revoke certifications.',
    'Pirated practice exams and course files.',
    'Discounted exam vouchers from anyone other than Pearson VUE.',
    'v2.0 guides that list six domains, or that claim WPA or private IPv4 addressing were removed.'
  ]
};
