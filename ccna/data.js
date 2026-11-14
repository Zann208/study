/* CCNA console content: official 200-301 v2.0 exam topics, lab plan and case studies.
   Source of exam topics: Cisco Learning Network, "200-301 CCNA v2.0 Exam Topics" (first test date 3 Feb 2027).
   Edit labs and cases here; personal progress (objective status, lab status, exam date, practice scores)
   is saved in the browser by ccna.js. */
window.CCNA_DATA = {
  exam: { code: '200-301', version: '2.0', minutes: 120, firstTest: '2027-02-03' },

  domains: [
    { id: 'd1', no: '1.0', title: 'Network Infrastructure and Connectivity', weight: 25, objectives: [
      { id: '1.1', text: 'Diagnose interface and cable (copper and fiber) issues such as collisions, errors, mismatched duplex, speed, distance, interface, signal levels, pin out, and cable types' },
      { id: '1.2', text: 'Describe the role and function of hypervisors, virtual machines, and containers' },
      { id: '1.3', text: 'Troubleshoot IPv4 address configuration, assignment, and subnetting (public and private)' },
      { id: '1.4', text: 'Troubleshoot IPv6 address configuration, assignment, and prefix sizing (unicast and modified EUI 64)' },
      { id: '1.5', text: 'Describe wireless principles', subs: ['Band and channel selection', 'RF characteristics', 'Security protocols', 'Cause of interference'] },
      { id: '1.6', text: 'Troubleshoot wired and wireless client connectivity (IP configuration, network reachability, and wireless security parameters on Windows, MacOS, and Linux)' },
      { id: '1.7', text: 'Troubleshoot DHCPv4 client, server, and relay on IOS devices' }
    ] },
    { id: 'd2', no: '2.0', title: 'Switching and Network Access', weight: 25, objectives: [
      { id: '2.1', text: 'Configure network infrastructure connectivity (switch-to-switch and switch-to-router)', subs: ['Layer 2/Layer 3 physical interfaces', 'Layer 2 802.1Q trunk interfaces', 'Layer 2/Layer 3 LACP port-channel/EtherChannel', 'Switch virtual interface (SVI)'] },
      { id: '2.2', text: 'Configure Layer 2 switch port attributes for edge-host connectivity (VLAN, PoE, port channel, and LACP)', subs: ['Desktop, printer, and IOT appliances', 'Wireless access points (standalone and controller based)', 'Voice over IP phone', 'Virtualized hosts', 'Network appliances'] },
      { id: '2.3', text: 'Validate the accuracy of network documentation using CDP and LLDP' },
      { id: '2.4', text: 'Troubleshoot basic Layer 2/Layer 3 connectivity and device operations using show commands (including show logs), ping, extended ping, trace route, and packet capture output' },
      { id: '2.5', text: 'Configure operations of the Rapid Per VLAN Spanning Tree Protocol (Rapid PVST+)', subs: ['Root port, root bridge (primary/secondary), and other port names', 'Port states and roles', 'PortFast', 'Root guard, loop guard, and BPDU guard'] }
    ] },
    { id: 'd3', no: '3.0', title: 'IP Routing', weight: 20, objectives: [
      { id: '3.1', text: 'Interpret a routing table to identify the next hop for a packet (routing protocol, prefix/mask, administrative distance, metric, and default route)' },
      { id: '3.2', text: 'Troubleshoot IPv4 and IPv6 static routing', subs: ['Default route', 'Network route', 'Host route', 'Floating static'] },
      { id: '3.3', text: 'Configure single area OSPFv2 for IPv4 and OSPFv3 for IPv6', subs: ['Neighbor adjacencies (excluding authentication)', 'Point-to-point', 'Broadcast (DR/BDR selection)', 'Router ID'] },
      { id: '3.4', text: 'Interpret the operational status of First Hop Redundancy Protocols (HSRP and VRRP)' }
    ] },
    { id: 'd4', no: '4.0', title: 'Network Services and Security', weight: 20, objectives: [
      { id: '4.1', text: 'Configure network devices with local usernames and as an AAA client (TACACS+ and RADIUS) for management' },
      { id: '4.2', text: 'Manage device configuration and software files using secure file transfer operations with SFTP/SCP' },
      { id: '4.3', text: 'Configure NAT/PAT on IOS XE routers' },
      { id: '4.4', text: 'Diagnose issues with DNS records (A, AAAA, CNAME, MX, NS, and PTR) to support host, web application, and mail server access by name' },
      { id: '4.5', text: 'Describe IPsec remote access and site-to-site VPNs (protocols and transport modes)' },
      { id: '4.6', text: 'Configure IPv4 access control lists (standard, extended, numbered, and named ACLs)' },
      { id: '4.7', text: 'Configure Layer 2 security features', subs: ['DHCP snooping', 'Dynamic ARP inspection', 'Storm control', 'RA guard', 'Port security'] }
    ] },
    { id: 'd5', no: '5.0', title: 'AI, and Network Operations and Management', weight: 10, objectives: [
      { id: '5.1', text: 'Describe the role of agentic AI in network operations' },
      { id: '5.2', text: 'Select a prompt to send to a generative AI system to support network operations considering prompt components such as data classification, output format, persona, and instructions' },
      { id: '5.3', text: 'Describe network management approaches (device-based, cloud-based, controller-based, automation-based, and infrastructure as code)' },
      { id: '5.4', text: 'Describe the function of SNMP in network operations' },
      { id: '5.5', text: 'Use configuration management mechanisms such as Ansible to execute commands' },
      { id: '5.6', text: 'Interpret syslog message content, severity levels, and facilities' }
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
    { id: 'L-10', title: 'Single-area OSPFv2 and OSPFv3', domain: '3.0', tool: 'GNS3', obj: ['3.3'] },
    { id: 'L-11', title: 'HSRP operational status', domain: '3.0', tool: 'GNS3', obj: ['3.4'] },
    { id: 'L-12', title: 'Local users, AAA and SCP transfer', domain: '4.0', tool: 'GNS3', obj: ['4.1', '4.2'] },
    { id: 'L-13', title: 'NAT and PAT on IOS XE', domain: '4.0', tool: 'GNS3', obj: ['4.3'] },
    { id: 'L-14', title: 'Standard and extended ACLs', domain: '4.0', tool: 'Packet Tracer', obj: ['4.6'] },
    { id: 'L-15', title: 'DHCP snooping, DAI and port security', domain: '4.0', tool: 'Packet Tracer', obj: ['4.7'] },
    { id: 'L-16', title: 'Syslog and SNMP monitoring', domain: '5.0', tool: 'GNS3', obj: ['5.4', '5.6'] },
    { id: 'L-17', title: 'Ansible command execution', domain: '5.0', tool: 'Ansible', obj: ['5.5'] }
  ],

  /* Case studies: add { id: 'CS-01', title: '', summary: '', tags: [], href: '' } entries here once published. */
  cases: []
};
